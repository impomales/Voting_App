var React = require('react')
var $ = require('jquery')

var Poll = React.createClass({
    getInitialState: function() {
        return {data: {}, option: ''}
    },
    componentDidMount: function() {
        $.ajax('/api/polls/' + this.props.params.id).done(function(data) {
            this.setState({data: data, option: 0})
        }.bind(this))
    },
    handleOptionChange: function(e) {
        this.setState({option: e.target.value})
    },
    handleSubmit: function(e) {
        e.preventDefault()
        var vote = this.state
        $.ajax({
            url: '/api/vote',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(vote),
            success: function(data) {
                console.log('vote successfully added!')
                $.ajax('/api/polls/' + this.props.params.id)
                    .done(function(data) {
                        this.setState({data: data, option: 0})
                    }.bind(this)
                )
            }.bind(this),
            error: function(xhr, status, err) {
                console.err(this.props.url, status, err.toString())
            }.bind(this)
        })
        
    },
    render: function() {
        // need to create list of options beforehand.
        var options = []
        if (this.state.data.options) {
            console.log(this.state.data)
            options = this.state.data.options.map(function(item, index) {
                return (
                    <option 
                        value={index} 
                        key={index}
                    >{item.title}</option>
                )
            })
        }
        return (
            <div className='poll'>
                <p>{this.state.data.title}</p>
                <form className='votingForm'>
                    <p>Please choose an option</p>
                    <select name='options' onChange={this.handleOptionChange}>
                        {options}
                    </select><br />
                    <button onClick={this.handleSubmit}>Vote</button>
                </form>
            </div>
        )
    }
})

module.exports = Poll