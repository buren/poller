# Poller

Deploy [poller-server](https://github.com/buren/poller-server), in less than 2 minutes, to Heroku with one click.

[Poller](https://github.com/buren/poller#getting-started), get started with a couple of lines of HTML.

## Getting started

```html
<script>
  var yourPollerServerUrl = 'https://throwawaypoll.herokuapp.com';
  PollerConfig = { url: yourPollerServerUrl };
</script>
<script src="js/poller.js"></script>
```

If you want to use the HTML integration, add
```html
<script src="js/poller-dom.js"></script>
```

## HTML

Create a poll that can be answered multiple times and display a Bar chart beneath that updates every 2 seconds.

```html
<div data-poller="weather" data-multi-vote>
  <h3>What do you think about the weather today?</h3>
  <button data-answer="Love it">Love it</button>
  <button data-answer="Hate it">Hate it</button>
  <button data-answer="Indifferent">Indifferent</button>
  <div data-chart="Bar" data-refresh="2"></div>
</div>
```

__Answer__:

Any element can be used for the answer, the only thing required is to add a `data-answer` attribute. `Poller` then listens to the elements click event and will prevent default element behavior.

All of the below are valid
```html
<div data-poller="rating" data-multi-vote>
  <button data-answer="1">1</button>
  <a href="#" data-answer="2">2</a>
  <div data-answer="3">Three</div>
  <img src="http://placehold.it/150x150&text=4" data-answer="4" />
  <!-- if an elements data-answer is empty the text will be used instead -->
  <button data-answer>5</button>
  <div data-answer="">6</div>
</div>
```

Points answers (x/y)
```html
<!-- For x/y points: add 'data-points' attribute -->
<div data-poller="person" data-points>
  <h3>Whats your name and age?</h3>
  <input type="text" name="x" placeholder="Name">
  <input type="number" name="y" placeholder="Age">
  <!-- For submit trigger: add 'data-submit' attribute -->
  <button data-submit>Submit</button>
</div>
```

You'll need to add a `data-points` attribute to the root poller element and `data-submit` to the element you want to have as a submit trigger.

__Chart__:

Simplest example
```html
<div data-chart></div>
```

Refresh chart every 2 seconds
```html
<div data-chart data-refresh="2"></div>
```

Render as line chart
```html
<div data-chart="Line"></div>
```

_Available chart types_: Line, Pie, Column, Bar, Area, Scatter, Geo.

By default it will render a Column chart.

__Options__:

You can put components together how you like
```html
<!-- One answer -->
<div data-poller="question">
  <button data-answer="Answer">Answer</button>
</div>

<!-- Another answer -->
<div data-poller="question">
  <button data-answer="Answer 1">Answer 1</button>
</div>

<!-- Only chart -->
<div data-poller="question">
  <div data-chart></div>
</div>

<!-- Together -->
<div data-poller="question">
  <button data-answer="Answer 2">Answer 2</button>
  <div data-chart></div>
</div>
```

Answers put in separate a `data-poller` will each be answerable once.

PollerConfig:
```js
var serverUrl = 'https://throwawaypoll.herokuapp.com';
PollerConfig = {
  url: serverUrl,   // Required: Server URL
  onReady: true,    // By default initialize HTML components on document ready
  multiVote: false, // By default multiple votes is not allowed
  voted: false      // By default the user is assumed not to have voted
};
```

Manually initialize PollerDOM components:
```js
PollerDOM.createAll();
```

### JavaScript

If you don't want to use the HTML integration you can interact with the Poller server directly.

Simple poll
```js
var poller = new Poller({id: 'weather'});

poll.submit('First answer'); // Submit answer
// By default only one submit is allowed, the rest will be ignored
poll.submit('First answer'); // Ignored
poll.result(function(result) {
  console.log(result['First answer']); // 1
});
```

Multi vote poll
```js
var poller = new Poller({id: 'weather', multiVote: true});

poll.submit('First answer'); // Submit answer
poll.submit('First answer'); // Submit answer
poll.result(function(result) {
  console.log(result['First answer']); // 2
});
```

x/y poll

```js
var opts = {
  id: 'person',
  points: true, // It's a x/y form
  multiVote: true
};
var poll = new Poller(opts);

poll.submit({x: 'buren', y: 26});  // Submit answer
poll.submit({x: 'constance', y: 24}); // Submit answer

// Get result
poll.result(function(result) {
  console.log(result); // [['buren', '26'], ['constance', '24']]
});
```

Enable Debug logger
```js
__POLLER__DEBUG__ = true;
```

## License

[MIT-LICENSE](LICENSE)
