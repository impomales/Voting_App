import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

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

function UserMenu() {
	return (
		<div>
			<Link to='/mypolls'>My Polls</Link>
			<Link to='/newpoll'>New Poll</Link>
			<a href='/logout'>Sign out</a>
		</div>
	);
};

function Menu(props) {
	if (props.isLoggedIn) return <UserMenu />
	return <GuestMenu />
};

function Header() {
	return (
		<div id='header'>
			<h1>Voting App</h1>
			<a href='/'>Home</a>
			<Menu isLoggedIn={true}/>
		</div>
	);
};

function NewPoll() {
	return <h2>New Poll</h2>
};

function Poll(props) {
	return <h2>Poll {props.match.params.id}</h2>
};

function MyPolls() {
	return <h2>My Polls</h2>
};

function Polls() {
	return <h2>Polls</h2>
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