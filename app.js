// IMPORT MODULES
const express = require('express')
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const { Client } = require('pg')
const client = new Client({
	database: 'testdatabase',
	host: 'localhost',
	user: process.env.POSTGRES_USER
})

client.connect();


// CONFIG MODULES
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));								// set static files 
app.use(bodyParser.urlencoded({extended: true}));


// POPULATE DATABASE
function populate() {
	client.query(`create table messages (id serial primary key, title text, body text, image text, date timestamp default now())`); 
	
	// making sure table exist before populating it
	setTimeout(function() {
		client.query(`insert into messages (title, body,image) values ('Food for thought', 'Life isn t about waiting for the storm to pass, it s about learning how to dance in the rain', 'walking.jpg')`);
		client.query(`insert into messages (title, body,image) values ('What is autumn really?', 'Autumn is one of the four seasons on Earth and is the transition from Summer into Winter. In North America, Autumn is also known as the fall, in which both Thanksgiving and Halloween are celebrated. One of the main features of Autumn is the shedding of leaves from deciduous trees.', 'forest.jpg')`);
		client.query(`insert into messages (title, body,image) values ('How to create folderstructure', 'Simply use the line sudo npm install express-generator -g', 'nah, thanks.')`);
		client.query(`insert into messages (title, body,image) values ('Node.js', 'Node.js is an asynchronous event driven JavaScript runtime, designed to build scalable network applications.', 'nah, thanks.')`);
		client.query(`insert into messages (title, body,image) values ('The Husbands Secret - Liane Moriarty', 'Mother of three and wife of John-Paul, Cecilia discovers an old envelope in the attic. Written in her husband s hand, it says: to be opened only in the event of my death. Curious, she opens it - and time stops. John-Pauls letter confesses to a terrible mistake which, if revealed, would wreck their family as well as the lives of others. Cecilia wants to do the right thing, but right for who?', 'nah, thanks.')`);
		client.query(`insert into messages (title, body,image) values ('Pug is awesome! ', 'Pug is a template engine for Node.js. A template engine allows us to inject data and then produce HTML. So, in short: At run time, Pug (and other template engines) replace variables in our file with actual values, and then send the resulting HTML string to the client.', 'nah, thanks.')`);
		client.query(`insert into messages (title, body,image) values ('When life is hard', 'I hate when I think I m buying organic vegetables and when I come home I discover they re just regular donuts.', 'nah, thanks.')`);
		client.query(`insert into messages (title, body,image) values ('Pretty', 'Autumn is a very beautiful season with the leaves changing colour and the nights being cooler.', 'leaves.jpg')`);
	}, 1000);
};

populate(); 


// RESTFUL ROUTING

//GET homepage (RENDER)
app.get('/', function (req, res) {

	client.query('select * from messages order by date desc')
	.then(result => { 
		let contentDB = result.rows;
		let messages = []; //declare here so variable is accessable outside for-loop

		for(let i = 0; i < contentDB.length; i++) {
			
			// making life harder by converting, splitting and re-organising the timestamp format
			let stringifyDate = contentDB[i].date.toString().split(' ');
			let date = `${stringifyDate[2]} ${stringifyDate[1]} ${stringifyDate[3]} at ${stringifyDate[4]}`;
			
			// push message object into array of messages; 
			messages.push(
				{
				id: contentDB[i].id,
				title: contentDB[i].title,
				body: contentDB[i].body,
				image: contentDB[i].image,
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
	
	const newItem = [req.body.title, req.body.body, req.body.image + '.jpg'];

	client.query('insert into messages (title, body, image) values ($1, $2, $3)', newItem)
	.then(result => {
		res.redirect('/');
	})
	.catch(e => console.error(e.stack));

});

//POST delete contribution
app.post('/delete', function(req, res) {

	const id = req.body.messageID; 

	client.query(`delete from messages where id='${id}'`)
	.catch(e => console.error(e.stack))
});

//POST edit contribution
app.post('/edit', function(req, res) {

	const title = req.body.title;
	const body = req.body.body;
	const id = req.body.id;

	client.query(`update messages set title='${title}', body='${body}' where id='${id}'`)
	.then(result => {
		setTimeout(function(){ 
			res.redirect('/'); 
		}, 3000);
	})
	.catch(e => console.error(e.stack));
});


//GET specific contribution 
app.get('/search', function(req,res) {
	const id = req.query.messageID; 
	
	client.query(`select * from messages where id='${id}'`)
	.then(result => {

		let content = {
			title: result.rows[0].title,
			body: result.rows[0].body
		};

		res.send({ contentEdit: content });
	})
	.catch(e => console.error(e.stack));
})

// SET UP PORT
app.listen(3000, function () {
  console.log('User Information App listening on port 3000.')
}); 


