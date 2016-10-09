var React = require('react')
var $ = require('jquery')

var Poll = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        $.ajax('/api/polls/' + this.props.params.id).done(function(data) {
            this.setState(data)
        }.bind(this))
    },
    render: function() {
        return (
            <div className='poll'>
                <p>{this.state.title}</p>
                <p> will add more to this</p>
            </div>
        )
    }
})

module.exports = Poll