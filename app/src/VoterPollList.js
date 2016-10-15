var PollTable = require('./PollTable')
var React = require('react')
var $ = require('jquery')

var VoterPollList = React.createClass({
    getInitialState: function() {
        return {polls: []}
    },
    componentDidMount: function() {
        $.ajax('/api/myPolls').done(function(data) {
            this.setState({polls: data})
        }.bind(this))
    },
    render: function() {
        if (this.state.polls.length == 0) return (<h3>Please Log in.</h3>)
        else
        return (
            <PollTable polls={this.state.polls} title='My Polls'/>    
        )
    }
})

module.exports = VoterPollList