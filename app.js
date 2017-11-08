// IMPORT MODULES
const express = require('express')
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// Postgress start <<<<
const { Client } = require('pg')
const client = new Client({
	database: 'bulletinboard',
	host: 'localhost',
	user: 'Nova'
})

client.connect();
// Postgres end  <<<<


// CONFIG MODULES
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));								// set static files 
app.use(bodyParser.urlencoded({extended: true}));


// SET UP ROUTING

//GET homepage (RENDER)
app.get('/', function (req, res) {

	client.query('select * from messages order by date desc')
	.then(result => { 
		let contentDB = result.rows;
		let messages = [];

		for(let i = 0; i < contentDB.length; i++) {
			
			// making my life harder by converting, splitting and re-organising the timestamp format
			let stringifyDate = contentDB[i].date.toString().split(' ');
			let date = `${stringifyDate[2]} ${stringifyDate[1]} ${stringifyDate[3]} at ${stringifyDate[4]}`;
			
			// push message object into array messages; 
			messages.push(
				{
				title: contentDB[i].title,
				body: contentDB[i].body,
				date: date
				}
			);
		};

		res.render('index', { contributions: messages });

	})
	.catch(e => console.error(e.stack));
});

//POST new contribution (RENDER)
app.post('/contribute', function(req, res) {
	
	const newItem = [req.body.title, req.body.body];
	console.log(newItem); 

	client.query('insert into messages (title, body) values ($1, $2)', newItem)
	.then(result => {
		res.redirect('/');
	})
	.catch(e => console.error(e.stack));

}); 

// SET UP PORT
app.listen(3000, function () {
  console.log('User Information App listening on port 3000.')
})



// QUERIES
// create table messages (id serial primary key, title text, body text, date timestamp default now())

// insert into messages (title, body) values ('Lorem ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.');

// insert into messages (title, body) values ('Sed do eiusmod tempor', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');

// insert into messages (title, body) values ('Id minim veniam', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.');








