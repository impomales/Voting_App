var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var Redirect = require('react-router').Redirect

var VoterPollList = require('./VoterPollList')
var PollList = require('./PollList')
var AddPoll = require('./AddPoll')
var Poll = require('./Poll')

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
      <Route path='/polls/myPolls' component={VoterPollList} />
      <Route path='/polls/addPoll' component={AddPoll} />
      <Route path='/polls/:id' component={Poll} />
      <Redirect from='/' to='/polls' />
      <Route path='*' component={NoMatch} />
    </Router>
  ),
  document.getElementById('polls')
)