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
                <thead>
                    <tr><th>{this.props.title}</th></tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
        )
    }
})

module.exports = PollTable