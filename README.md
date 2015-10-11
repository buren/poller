# Poller

Deploy [poller-server](https://github.com/buren/poller-server), in less than 2 minutes, to Heroku with one click.

[Poller](https://github.com/buren/poller#getting-started), get started with a couple of lines of HTML.

## Getting started

Get started by including [`poller.js`](https://github.com/buren/poller/blob/master/js/poller.js) and defining the server address.
```html
<script src="js/poller.js"></script>
<script>
  PollerConfig = { url: 'https://throwawaypoll.herokuapp.com' };
</script>
```

## HTML

Create a poll that can be answered multiple times and display a Bar chart beneath that updates every 2 seconds.
```html
<div data-poller="weather" data-multi>
  <h3>What do you think about the weather today?</h3>
  <button data-answer="Love it">Love it</button>
  <button data-answer="Hate it">Hate it</button>
  <button data-answer="Indifferent">Indifferent</button>
  <div data-chart="Bar" data-refresh="2"></div>
</div>
```

__Answer__:

Any element can be used for the answer, the only thing required is to add a `data-answer` attribute. `Poller` then listens to the elements click event.

All of the below are valid:
```html
<button data-answer="Answer">Answer</button>
<a href="#" data-answer="Answer">Answer</a>
<div data-answer="Answer">...</div>
<img src="http://placehold.it/150x150" data-answer="Answer" />
```

Points answers (x/y):
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

Simplest example:
```html
<div data-chart></div>
```

Refresh chart every 2 seconds:
```html
<div data-chart data-refresh="2"></div>
```

Render as line chart:
```html
<div data-chart="Line"></div>
```

_Available chart types_: Line, Pie, Column, Bar, Area, Scatter, Geo.

By default it will render a Column chart.

__Options__:

You don't have to have components in the same place as the questions:
```html
<div data-poller="question">
  <button data-answer="Answer">Answer</button>
</div>

<div data-poller="question">
  <button data-answer="Answer 1">Answer 1</button>
</div>

<div data-poller="question">
  <div data-chart></div>
</div>
```

### JavaScript

Simple poll
```js
var opts = {
  id: 'my-id', // Poll id
  multiVote: true // Allow users to cast multiple votes
};
var poll = new Poller(opts);

poll.submit('My answer'); // Submit answer
// Submit answer and log the response
poll.submit('My answer', function(response) {
  console.log(response.status); // 200
});

poll.result(function(result) {
  var myAnswerCount = result['My answer']; // 2
  console.log(myAnswerCount);
});
```

x/y poll

```js
var opts = {
  id: 'person',
  points: true, // It's a x/y form
  multiVote: true // Allow multiple votes
};
var poll = new Poller(opts);
var answer = {x: 'buren', y: 26};
var answer1 = {x: 'constance', y: 24};

poll.submit(answer);  // Submit answer
poll.submit(answer1); // Submit answer

// Get result
poll.result(function(result) {
  console.log(result); // [['buren', '26'], ['constance', '24']]
});
```

### Server

Poll result path
```js
var type = 'weather';
var url = 'https://throwawaypoll.herokuapp.com/polls_chart?question=' + type;
```

Poll vote path

```js
var type = 'weather';
var url = 'https://throwawaypoll.herokuapp.com/polls'
var urlParams = {question: weather, value: 'some value'}

// https://throwawaypoll.herokuapp.com/polls?type=weather&value=Indifferent
```

## License

[MIT-LICENSE](LICENSE)
