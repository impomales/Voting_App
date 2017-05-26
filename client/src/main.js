import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import $ from 'jquery';
import ip from 'ip';
import ObjectID from 'mongodb';
import {Grid, Row, Col, Clearfix, PageHeader,
		Jumbotron, ListGroup, ListGroupItem,
		Navbar, Nav, NavItem,
		NavDropdown, MenuItem, Button,
		FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import RC2 from 'react-chartjs2';

function NoMatch() {
	return <h2>No Match Found For This Route.</h2>
};

function GuestMenu() {
	return (
		<NavItem eventKey={2} href='/auth/google'>
			Sign in with Google.
		</NavItem>
	);
};

function UserMenu(props) {
	var title = 'Welcome, ' + props.user.username;
	return (
		<NavDropdown eventKey={2} title={title} id='user-menu-dropdown'>
			<LinkContainer to='/mypolls'>
				<MenuItem eventKey={2.1}>
					My Polls
				</MenuItem>
			</LinkContainer>
			<LinkContainer to='/newpoll'>
				<MenuItem eventKey={2.2}>
					New Poll
				</MenuItem>
			</LinkContainer>
			<MenuItem eventKey={2.3} href='/logout'>
				Sign out
			</MenuItem>
		</NavDropdown>
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
			<Navbar collapseOnSelect>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to='/'>Voting App</Link>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
						<LinkContainer to='/'>
							<NavItem eventKey={1}>
								Home
							</NavItem>
						</LinkContainer>
						<Menu user={this.state.user}/>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
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
				alert('poll successfully added');
				location.reload();
			}.bind(this),
			error: function(xhr, status, err) {
				console.err(this.props.url, err.toString())
			}.bind(this),
			complete: function(xhr, status) {
				this.setState({title: '', choices: ''});
			}.bind(this)
		});
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit} className='polls-container'>
				<FormGroup>
					<ControlLabel>Title:</ControlLabel>
					<FormControl 
						type='text' 
						value={this.state.title}
						onChange={this.handleTitleChange} />
				</FormGroup>
				<FormGroup>
					<ControlLabel>Options (seperated by commas):</ControlLabel>
					<FormControl 
						componentClass='textarea' 
						value={this.state.choices} 
						onChange={this.handleChoicesChange}/>
				</FormGroup>
				<Button type='submit'>Add Poll</Button>
			</form>
		);
	}
};

class Vote extends React.Component {
	// must handle non logged in users on client side.
	// logged in users are handled server side.
	constructor(props) {
		super(props);
		this.state = {choice: 0, title: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleNewChoice = this.handleNewChoice.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({choice: parseInt(e.target.value)})
	}

	handleNewChoice(e) {
		this.setState({title: e.target.value});
	}

	handleSubmit(e) {
		e.preventDefault();
		// if count == choices_count
		// do addNewChoice else regular vote
		// double voting not handled yet.
		var vote = {};
		var url = '';

		if (this.state.choice === this.props.poll.choices.length) {
			vote = {
				title: this.state.title,
				choices: this.props.poll.choices
			}

			url = '/api/choice/' + this.props.poll._id;

			
		} else {
			vote = {
				choice: this.state.choice,
				choices: this.props.poll.choices
			}

			url = '/api/vote/' + this.props.poll._id;
		}

		$.ajax('https://api.ipify.org?format=json').done(function(data) {
			vote.ip = data.ip;

			$.ajax({
				url: url,
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify(vote),
				success: function(data) {
					alert('vote was successful');
				}.bind(this),
				error: function(xhr, status, err) {
					alert('double voting not allowed');
				}.bind(this),
				complete: function(xhr, status) {
					this.props.update();
				}.bind(this)
			});
		}.bind(this));
	}

	render() {
		var choices = this.props.poll.choices.map(function(item, index) {
			return <option key={index} value={index}>{item.title}</option>
		});

		var choices_count = this.props.poll.choices.length;

		// add choice option shouldn't be available to non logged in users ***
		var newOption = (this.props.user) ? <option key={choices_count} value={choices_count}> - Add new option - </option> : null;

		var newChoice = ((this.state.choice === choices_count)  && this.props.user) ? 
				<FormGroup><FormControl type='text' value={this.state.title} onChange={this.handleNewChoice} /></FormGroup> :
				null;

		return (
			<form onSubmit={this.handleSubmit}>
				<FormGroup>
					<ControlLabel>Vote here</ControlLabel>
					<FormControl 
						componentClass='select'
						value={this.state.choice}
						onChange={this.handleChange}
						placeholder='select'>
						{choices}
						{newOption}
					</FormControl>
				</FormGroup>
				{newChoice}
				<Button type='submit'>Vote</Button>
			</form>
		);
	}
}

class Result extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var labels = this.props.results.map(function(item) {
			return item.title;
		});

		var data = this.props.results.map(function(item) {
			return item.count;
		});
		// should add a max limit of how many choices allowed in poll.
		var pieData = {
			labels: labels,
	    datasets: [
	        {
	            data: data,
	            backgroundColor: [
	                '#ff6384',
	                '#36a2eb',
	                '#ffce56',
	                '#1f77b4', 
	                '#e377c2', 
	                '#ff7f0e', 
	                '#2ca02c', 
	                '#bcbd22', 
	                '#d62728',
        			'#17becf', 
        			'#9467bd', 
        			'#7f7f7f', 
        			'#8c564b', 
        			'#3366cc'
	            ],
	            hoverBackgroundColor: [
	                '#ff6384',
	                '#36a2eb',
	                '#ffce56',
	                '#1f77b4', 
	                '#e377c2', 
	                '#ff7f0e', 
	                '#2ca02c', 
	                '#bcbd22', 
	                '#d62728',
        			'#17becf', 
        			'#9467bd', 
        			'#7f7f7f', 
        			'#8c564b', 
        			'#3366cc'
	            ]
	        }]
		}

		return <RC2 data={pieData} type='pie' />;
	}
}

class Delete extends React.Component {
	constructor(props) {
		super(props);

		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		var url = '/api/polls/' + this.props.poll._id;
		$.ajax({
			url: url,
			type: 'DELETE',
			contentType: 'application/json',
			success: function(data) {
				alert('poll successfully deleted');
				location.reload();
			}.bind(this),
			error: function(xhr, status, err) {
				console.err(this.props.url, status, err.toString());
			}.bind(this)
		});
	}
	
	render() {
		var deleteButton = (this.props.user && this.props.user._id === this.props.poll.created_by)
		? <Button bsStyle='danger' onClick={this.handleDelete}>Delete</Button> : null;
		return <div>{deleteButton}</div>;
	}
}

class Poll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {poll: null, user: null};

		this.updateResults = this.updateResults.bind(this);
	}

	componentDidMount() {
		this.updateResults();		
	}

	updateResults() {
		$.ajax('/api/user').done(function(data) {
			$.ajax('/api/polls/' + this.props.match.params.id).done(function(poll) {
				this.setState({poll: poll.poll, user: data.user});
			}.bind(this));
		}.bind(this));
	}

	render() {
		// weird rendering bug going on...temporary solution.
		if (!this.state.poll) return <div></div>
		return (
			<div className='polls-container'>
				<Grid>
					<Row>
						<Col xs={12}>
							<PageHeader>
								<small>{this.state.poll.title}</small>
							</PageHeader>
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={6}>
							<Vote poll={this.state.poll} user={this.state.user} update={this.updateResults}/>
						</Col>
						<Col xs={12} md={6}>
							<Result results={this.state.poll.choices} />
						</Col>
					</Row>
				</Grid>				
				{/*only show delete component when user_id === poll.created_by
				careful comparing ids.*/}
				<Delete poll={this.state.poll} user={this.state.user}/>
			</div>
		);
	}
};

function PollRow(props) {
	var link = '/polls/' + props.id;
	return (
		<LinkContainer to={link}>
			<ListGroupItem>{props.title}</ListGroupItem>
		</LinkContainer>
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
			<div className='polls-container'>
				<PageHeader>
					Voting App<br />
					<small>
						Below are the polls you created. Select a poll to see the results and vote, <Link to='/newpoll'>or make a new poll!</Link>
					</small>
				</PageHeader>
				<ListGroup>{myPolls}</ListGroup>
			</div>
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
			<div className='polls-container'>
				<PageHeader>
					Voting App<br />
					<small>
						Select a poll to see the results and vote, <Link to='/newpoll'>or make a new poll!</Link>
					</small>
				</PageHeader>
				<ListGroup>{polls}</ListGroup>
			</div>
		);
	}
};

function App() {
	return (
		<Jumbotron>
			<Header />
			<Switch>
				<Route path='/polls' exact component={Polls} />
				<Route path='/polls/:id' component={Poll} />
				<Route path='/mypolls' component={MyPolls} />
				<Route path='/newpoll' component={NewPoll} />
				<Redirect from='/' to='/polls' />
				<Route component={NoMatch} />
			</Switch>
		</Jumbotron>
	);
}

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('root')
);