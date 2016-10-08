var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var Redirect = require('react-router').Redirect

var PollList = require('./PollList')

var NoMatch = React.createClass({
  render: function() {
    return (
      <h2>NO MATCH FOR THIS ROUTE! SORRY!!!</h2>  
    )
  }
})

ReactDOM.render(
  (
    <Router>
      <Route path='/polls' component={PollList} />
      <Redirect from='/' to='/polls' />
      <Route path='*' component={NoMatch} />
    </Router>
  ),
  document.getElementById('polls')
)