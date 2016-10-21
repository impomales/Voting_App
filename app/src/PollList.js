var PollTable = require('./PollTable')
var React = require('react')
var $ = require('jquery')

var PollList = React.createClass({
    getInitialState: function() {
        return {polls: []}
    },
    componentDidMount: function() {
        $.ajax('/api/polls').done(function(data) {
            this.setState({polls: data})
        }.bind(this))
    },
    render: function() {
        return (
            <div className='PollList'>
                <PollTable polls={this.state.polls} title='All Polls'/>
            </div>
        ) 
    }
})

module.exports = PollList