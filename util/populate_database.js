var models = require('../models/models');
var Poll = models.Poll;

var examplePolls = [
			{
				title: 'Pepsi or Coke?',
				created_by: '5927b89e495a8845b5365044',	// id of Isaias
				choices: [
					{title: 'Pepsi', count: 5},
					{title: 'Coke', count: 4}
				]
			},
			{
				title: 'Favorite Food',
				created_by: '000000000000000000000002',
				choices: [
					{title: 'Pizza', count: 3},
					{title: 'Pasta', count: 5},
					{title: 'French Fries', count: 10},
					{title: 'Fried Chicken', count: 8}
				]
			},	// this one is not created by current user.
			{
				title: 'Countries you would like to travel to',
				created_by: '000000000000000000000002',
				choices: [
					{title: 'France', count: 4},
					{title: 'Germany', count: 3},
					{title: 'Brazil', count: 3},
					{title: 'Japan', count: 4},
					{title: 'Canada', count: 5}
				]
			},
			{
				title: 'Drink of Choice',
				created_by: '5927b89e495a8845b5365044',
				choices: [
					{title: 'Beer', count: 3},
					{title: 'Wine', count: 4},
					{title: 'Whiskey', count: 2},
					{title: 'Vodka', count: 3},
					{title: 'Tequila', count: 4}
				]
			}];

Poll.create(examplePolls, function(err, result) {
	if (err) throw err;
	process.exit();
});