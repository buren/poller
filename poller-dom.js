(function (window) {
  'use strict';

  var COMPONENT_SELECTOR = '[data-poller]';

  var __NEXT_CHART_ID__ = 0;
  var nextChartId = function() {
    return __NEXT_CHART_ID__++;
  }

  function onClick($el, callback) {
    $el.click(function(event) {
      event.preventDefault();
      callback($(this));
    });
  }

  var PollerDOM = {
    createAll: function() {
      $.each($(COMPONENT_SELECTOR), function(index, element) {
        PollerDOM.create($(this));
      });
    },
    create: function($el) {
      PollerDOM._add(new PollerElement($el));
    },
    _add: function(poller) {
      PollerDOM[poller.getId()] = poller;
    }
  };

  function PollerElement($el) {
    var self = this;
    var id;

    var getAttr = function(name) {
      return $el.attr('data-' + name);
    };

    id = getAttr('poller');

    self.getId = function() {
      return id;
    };

    if (!id) {
      throw new Error('[PollerElement] Element must have id attribute defined.');
    }

    self.client = new Poller({
      id: id,  // Question id
      points: getAttr('points') !== undefined, // Answer is point
      multiVote: getAttr('multi-vote') !== undefined, // Allow multiple votes
      voted: false // Has the user voted
    });

    var onAnswer = function($el, value) {
      if (self.client.isSingleVote()) {
        Core.log('[PollerElement] onAnswer hiding: ', $el);
        $el.css('opacity', '0.1');
      }

      self.client.submit(value, function(_data) {
        Core.log('[PollerElement] submit answer: ', value);
      });
    };

    new AnswerDOM($el, onAnswer);
    new PointAnswerDOM($el, onAnswer);
    new PollerChartDOM($el, self.client.resultUrl());
  }

  function AnswerDOM($el, callback) {
    var self = this;

    var dataAttrName = 'data-answer';
    var $answers = $el.find('[' + dataAttrName + ']')

    if ($answers.length === 0) {
      Core.log('[AnswerDOM] Answer data not found in $el:', $el);
      return;
    }

    var getAnswer = function($el) {
      var value = $el.attr(dataAttrName);
      // If the data attribute is empty grab the text instead
      if (value.length === 0) value = $el.text();
      return value;
    };

    onClick($answers, function($el) {
      var value = getAnswer($el);
      callback($answers, value);
    });
  }

  function PointAnswerDOM($el, callback) {
    var $submit = $el.find('[data-submit]');

    if ($submit.length === 0) {
      Core.log('[PointAnswerDOM] Point submit not found in $el:', $el);
      return;
    }

    var getValue = function(fieldName) {
      return $el.find('[name="' + fieldName + '"]').val();
    };

    onClick($submit, function() {
      var value = {
        x: getValue('x'),
        y: getValue('y')
      };
      callback($submit, value);
    });
  }

  function PollerChartDOM($el, dataSource) {
    var $chart = $el.find('[data-chart]');

    if ($chart.length === 0) {
      Core.log('[PollerChartDOM] No chart found in $el:', $el);
      return;
    }

    var chartType = $chart.attr('data-chart');
    var chartId = 'chart-' + nextChartId(); // The chart id
    var html = '<div id="' + chartId + '"></div>'; // Chart HTML
    $chart.html(html); // Set HTML

    var opts = { chartType: chartType };
    // Chart refresh option
    var refresh = parseInt($chart.attr('data-refresh'), 10);
    if (!isNaN(refresh)) opts.refresh = refresh*1000;

    // Initialize the chart
    createChart(chartId, dataSource, opts);
  }

  function createChart(id, dataSource, opts) {
    var chartType = 'ColumnChart';

    if (opts.chartType && opts.chartType.length > 0) {
      chartType = opts.chartType + 'Chart';
    }
    new Chartkick[chartType](id, dataSource, opts);
  }

  // Build poll selectors
  function pollSelector(id, selector) {
    var baseSelector = '[data-poller="' + id + '"] ';
    return baseSelector + (selector || '');
  };

  if (PollerConfig.onReady) {
    $(document).ready(function() {
      PollerDOM.createAll();
    });
  }

  // Expose PollerDOM to the outside world
  var Core = window.PollerCore;
  window.PollerDOM = PollerDOM;
}(window));
