(function (window) {
  'use strict';

  function config(key) {
    var config = window.PollerConfig === undefined ? {} : window.PollerConfig;
    config.onReady = config.onReady === undefined ? true : config.onReady;
    return config[key];
  }

  function Poller(opts) {
    var self = this;

    // Get user config or define an empty object
    self.url = config('url'); // Server url
    if (!self.url) {
      var msg = 'PollerConfig.url property must be set.'
      msg    += " Make sure you've defined PollerConfig _before_ including poller.js"
      msg    += " Example: PollerConfig = { url: 'https://throwawaypoll.herokuapp.com' };"
      console.error(msg);
      return;
    }

    self.id = opts.id; // Element id
    self.points = opts.points || false;
    self.multiVote = opts.multiVote || false; // Allow multi votes
    self.voted = false; // Has the user voted

    self.$poll = $(self.pollSelector());

    self.resultUrl = self.url + '/result?question=' + self.id + '&points=' + self.points; // Poll result url
    self.pollUrl = self.url + '/poll'; // Submit poll answer url

    // Call the init function
    self.init();
  }

  Poller.prototype.init = function () {
    var self = this;

    // Attach anwser click event handler
    var attachAnswerClickEvent = function() {
      var dataAttr = 'data-answer'; // Answer element data attribute name
      var selector = self.pollSelector('[' + dataAttr + ']'); // Answer element selector
      $(document).on('click', selector, function(event) {
        event.preventDefault(); // Prevent default element action
        var value = $(this).attr(dataAttr); // Get answer
        // Submit the answer
        self.submit(value, function(_json) {
          console.log('Voted: ' + value);
          self.dimWhenSingleVote($(selector));
        });
      });
    };

    var attachSubmitClickEvent = function() {
      var selector = self.pollSelector('[data-submit]');
      $(document).on('click', selector, function(event) {
        event.preventDefault();
        var x = self.$poll.find('[name="x"]').val();
        var y = self.$poll.find('[name="y"]').val();
        var answer = {x: x, y: y};
        self.submit(answer, function(_json) {
          console.log('Answered: ', answer);
          self.dimWhenSingleVote($(selector));
        });
      });
    };

    // Initialize the chart
    var initPollChart = function() {
      var $chart = $(self.pollSelector('[data-chart]'));
      // Return if there isn't a chart element
      if (!$chart.length > 0) {
        return;
      }
      var chartType = $chart.attr('data-chart');
      var chartId = 'chart-' + self.id; // The chart id
      var html = '<div id="' + chartId + '"></div>'; // Chart HTML
      var opts = {}; // Chart options

      // Chart refresh option
      var refresh = parseInt($chart.attr('data-refresh'), 10);
      if (!isNaN(refresh)) opts.refresh = refresh*1000;

      // Set chartType
      opts.chartType = chartType;

      // Set chart HTML
      $chart.html(html);

      // Initialize the chart
      self.resultChart(chartId, opts);
    };

    attachAnswerClickEvent();
    attachSubmitClickEvent();
    initPollChart();
  };

  // Submit poll answer
  Poller.prototype.submit = function(value, callback) {
    var self = this;
    var params;
    var url;

    if (typeof value === 'string') {
      params = {value: value};
    } else {
      params = {
        points: true,
        x: value.x,
        y: value.y
      };
    }
    params.question = self.id;

    // If multivote is set allow, otherwise check if the user already has voted
    if (self.multiVote || !self.voted) {
      // Submit the request (shouldn't be GET but POST..)
      $.getJSON(self.pollUrl, params, function(json) {
        if (callback) {
          callback(json); // Invoke callback
        }
      });
    } else {
      console.log('Already voted.');
    }
    self.voted = true;
  };

  // Get poll result
  Poller.prototype.result = function(callback) {
    var self = this;
    // Send GET request for poll result
    $.getJSON(self.resultUrl, function(json) {
      callback(json); // Invoke callback
    });
  };

  // Create a chart for poll result
  Poller.prototype.resultChart = function(id, options) {
    var self = this;
    var opts = options || {};
    var chartType;
    if (opts.chartType && opts.chartType.length > 0) {
      chartType = opts.chartType + 'Chart';
    } else {
      chartType = 'ColumnChart';
    }
    // Initialize the chart
    new Chartkick[chartType](id, self.resultUrl, opts);
  };

  // Build poll selectors
  Poller.prototype.pollSelector = function(selector) {
    var baseSelector = '[data-poller="' + this.id + '"] ';
    return baseSelector + (selector || '');
  };

  // If only allowed to vote once dim the answers
  Poller.prototype.dimWhenSingleVote = function($element) {
    if (!this.multiVote) {
      $element.css('opacity', '0.1');
    }
  };

  function PollerDOMInit() {
    // For each HTML element with data-poller as attribute
    $.each($('[data-poller]'), function(index, element) {
      var $el = $(element);
      var id = $el.attr('data-poller'); // Get elements data-poller attribute
      var multi = $el.attr('data-multi') !== undefined; // Check if elements data-multi attribute is set
      var points = $el.attr('data-points') !== undefined; // Check if elements data-points attribute is set

      if (!id) {
        console.log('Element must have id attribute defined.');
      }
      // Poll options
      var options = {
        id: id,
        multiVote: multi,
        points: points
      };
      // Initialize the poll
      new Poller(options);
    });
  }

  if (config('onReady')) {
    // When the document is ready initialize all Pollers
    $(document).ready(function() {
      PollerDOMInit();
    });
  }

  // Expose the Poller funtion to the outside world
  window.Poller = Poller;
  window.PollerDOMInit = PollerDOMInit;
}(window));
