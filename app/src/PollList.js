var React = require('react')
var $ = require('jquery')

// list of polls by poll title.
var PollRow = React.createClass({
    render: function() {
        // need to add link to poll :id.
        return (
            <tr className='pollRow'>
                <td>{this.props.poll.title}</td>
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
            <table>
                <tbody>
                    {list}
                </tbody>
            </table>
        )
    }
})

var PollList = React.createClass({
    getinitialState: function() {
        return {polls: []}
    },
    componentDidMount: function() {
        
    },
    render: function() {
        return
    }
})