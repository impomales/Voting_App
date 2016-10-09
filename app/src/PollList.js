var React = require('react')
var $ = require('jquery')

// list of polls by poll title.
var PollRow = React.createClass({
    render: function() {
        // need to add link to poll :id.
        return (
            <tr className='pollRow'>
                <td>
                    <a href={'#/polls/' + this.props.poll._id}>
                        {this.props.poll.title}
                    </a>
                </td>
            </tr>    
        )
    }
})

var PollTable = React.createClass({
    render: function() {
        var list = this.props.polls.map(function(item) {
            return (
                <PollRow key={item._id} poll={item}/>    
            )
        })
        return (
            <table className='pollTable'>
                <tbody>
                    {list}
                </tbody>
            </table>
        )
    }
})

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
            <PollTable polls={this.state.polls}/>
        ) 
    }
})

module.exports = PollList