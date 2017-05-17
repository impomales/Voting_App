import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import $ from 'jquery';

function NoMatch() {
	return <h2>No Match Found For This Route.</h2>
};

function GuestMenu() {
	return (
		<div>
			<a href='/auth/google'>Sign in with Google.</a>
		</div>
	);
};

function UserMenu(props) {
	return (
		<div>
			<h3>Welcome, {props.user.username}</h3>
			<Link to='/mypolls'>My Polls</Link>
			<Link to='/newpoll'>New Poll</Link>
			<a href='/logout'>Sign out</a>
		</div>
	);
};

function Menu(props) {
	if (props.user) return <UserMenu user={props.user} />
	return <GuestMenu />
};

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {user: null};
	}

	componentDidMount() {
		$.ajax('/api/user').done(function(data) {
			this.setState({user: data.user});
		}.bind(this));
	}

	render() {
		return (
			<div id='header'>
				<h1><a href='/'>Voting App</a></h1>
				<a href='/'>Home</a>
				<Menu user={this.state.user}/>
			</div>
		);
	}
};

class NewPoll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {title: '', choices: ''};

		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleChoicesChange = this.handleChoicesChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleTitleChange(e) {
		this.setState({title: e.target.value});
	}

	handleChoicesChange(e) {
		this.setState({choices: e.target.value});
	}

	handleSubmit(e) {
		e.preventDefault();
		var poll = this.state;
		$.ajax({
			url: '/api/polls',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(poll),
			success: function(data) {
				console.log('poll successfully added');
				console.log(data);
			}.bind(this),
			failure: function(xhr, status, err) {
				console.err(this.props.url, err.toString())
			}.bind(this),
			complete: function(xhr, status) {
				this.setState({title: '', choices: ''});
			}.bind(this)
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Title: 
					<input type='text' value={this.state.title} onChange={this.handleTitleChange} />
				</label>
				<label>
					Options (seperated by commas):
					<textarea value={this.state.value} onChange={this.handleChoicesChange}></textarea>
				</label>
				<input type='submit' value='Add Poll' />
			</form>
		);
	}
};

function Poll(props) {
	return <h2>Poll {props.match.params.id}</h2>
};

function PollRow(props) {
	var link = '/polls/' + props.id;
	return (
		<tr>
			<td><Link to={link}>{props.title}</Link></td>
		</tr>
	);
}

class MyPolls extends React.Component {
	constructor(props) {
		super(props);
		this.state = {myPolls: []};
	}

	componentDidMount() {
		$.ajax('/api/mypolls').done(function(data) {
			this.setState({myPolls: data.myPolls});
		}.bind(this));
	}

	render() {
		var myPolls = this.state.myPolls.map(function(item) {
			return <PollRow key={item._id} id={item._id} title={item.title} />
		});
		return (
			<table>
				<tbody>{myPolls}</tbody>
			</table>
		);
	}
};

class Polls extends React.Component {
	constructor(props) {
		super(props);
		this.state = {polls: []};
	}

	componentDidMount() {
		$.ajax('/api/polls').done(function(data) {
			this.setState({polls: data.polls});
		}.bind(this));
	}

	render() {
		var polls = this.state.polls.map(function(item) {
			return <PollRow key={item._id} id={item._id} title={item.title} />
		});
		return (
			<table>
				<tbody>{polls}</tbody>
			</table>
		);
	}
};

function App() {
	return (
		<div id='app'>
			<Header />
			<Switch>
				<Route path='/polls' exact component={Polls} />
				<Route path='/polls/:id' component={Poll} />
				<Route path='/mypolls' component={MyPolls} />
				<Route path='/newpoll' component={NewPoll} />
				<Redirect from='/' to='/polls' />
				<Route component={NoMatch} />
			</Switch>
		</div>
	);
}

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('root')
);