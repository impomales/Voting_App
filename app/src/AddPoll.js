var React = require('react')
var $ = require('jquery')

var AddPoll = new React.createClass({
    getInitialState: function() {
        return {title: '', options: ''}
    },
    handleTitleChange: function(e) {
        this.setState({title: e.target.value})
    }, 
    handleOptionsChange: function(e) {
        this.setState({options: e.target.value})
    },
    handleSubmit: function(e) {
        e.preventDefault()
        var poll = this.state
        $.ajax({
            url: '/api/polls',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(poll),
            success: function(data) {
                console.log('poll added successfully')
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
        this.setState({title: '', options: ''})
    }, 
    render: function() {
        return (
            <div className='addPoll'>
                <h2>Add a New Poll!</h2>
                <form className='addPollForm'>
                    <h3>Title</h3>
                    <input 
                        type='text' 
                        name='title' 
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                    /><br />
                    <h3>Options</h3><p>(each option separated by commas.)</p>
                    <textarea 
                        name='options' 
                        form='addPollForm' 
                        value={this.state.options}
                        onChange={this.handleOptionsChange}
                    ></textarea><br />
                    <button onClick={this.handleSubmit}>Add New Poll</button>
                </form> 
            </div>
        )
    } 
})

module.exports = AddPoll