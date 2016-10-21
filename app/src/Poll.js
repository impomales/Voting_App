var React = require('react')
var $ = require('jquery')

var Poll = React.createClass({
    getInitialState: function() {
        return {data: {}}
    },
    componentDidMount: function() {
        $.ajax('/api/polls/' + this.props.params.id).done(function(data) {
            this.setState({data: data})
        }.bind(this))
    },
    render: function() {
        // need to create list of options beforehand.
        var options = []
        if (this.state.data.options) {
            console.log(this.state.data)
            options = this.state.data.options.map(function(item, index) {
                return (
                    <option value={item.title} key={index}>{item.title}</option>
                )
            })
        }
        return (
            <div className='poll'>
                <p>{this.state.data.title}</p>
                <form className='votingForm'>
                    <p>Please choose an option</p>
                    <select name='options'>
                        {options}
                    </select><br />
                    <button>Vote</button>
                </form>
            </div>
        )
    }
})

module.exports = Poll