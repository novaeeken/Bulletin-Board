
//------------------------------------------   IMPORT REQUIRED DEPENDENCIES ------------------------------------------


const Sequelize = require('sequelize')
const express = require('express')
const bodyParser = require('body-parser')


//-----------------------------------------------  CONFIG MODULES  -------------------------------------------------


const app = express(); 

const sequelize = new Sequelize('bulletinboard',process.env.POSTGRES_USER,null,{
  host: 'localhost',
  dialect: 'postgres',
}); 

app.use(express.static('public')) // set static files 
app.set('views','views')      // set view engine 
app.set('view engine','pug')

app.use(bodyParser.urlencoded({extended: true})); 

// SET UP PORT
app.listen(3000, function () {
  console.log('User Information App listening on port 3000.')
}); 


//-----------------------------------------------  MODEL DEFINITION  ----------------------------------------------

const Message = sequelize.define('messages',{
	title: {type: Sequelize.STRING},
	body: {type: Sequelize.TEXT},
	image: {type: Sequelize.STRING},
	createdAt: Sequelize.DATEONLY,
	updatedAt: Sequelize.DATEONLY
}); 

sequelize.sync({force: true})
.then( () => {
	Message.bulkCreate([
		{title: 'Food for thought', body: 'Life isn t about waiting for the storm to pass, it s about learning how to dance in the rain', image: 'walking.jpg'},
		{title: 'What is autumn really?', body: 'Autumn is one of the four seasons on Earth and is the transition from Summer into Winter. In North America, Autumn is also known as the fall, in which both Thanksgiving and Halloween are celebrated. One of the main features of Autumn is the shedding of leaves from deciduous trees.', image: 'forest.jpg'},
		{title: 'How to create folderstructure', body: 'Simply use the line sudo npm install express-generator -g', image: 'nah, thanks.'},
		{title: 'Node.js', body: 'Node.js is an asynchronous event driven JavaScript runtime, designed to build scalable network applications.', image: 'nah, thanks.'},
		{title: 'The Husbands Secret - Liane Moriarty', body: 'Mother of three and wife of John-Paul, Cecilia discovers an old envelope in the attic. Written in her husband s hand, it says: to be opened only in the event of my death. Curious, she opens it - and time stops. John-Pauls letter confesses to a terrible mistake which, if revealed, would wreck their family as well as the lives of others. Cecilia wants to do the right thing, but right for who?', image: 'nah, thanks.'},
		{title: 'Pug is awesome!', body: 'Pug is a template engine for Node.js. A template engine allows us to inject data and then produce HTML. So, in short: At run time, Pug (and other template engines) replace variables in our file with actual values, and then send the resulting HTML string to the client.', image: 'nah, thanks.'},
		{title: 'When life is hard', body: 'I hate when I think I m buying organic vegetables and when I come home I discover they re just regular donuts.', image: 'nah, thanks.'},
		{title: 'Pretty', body: 'Autumn is a very beautiful season with the leaves changing colour and the nights being cooler.', image: 'leaves.jpg'},
	]); 
}).catch( e => console.error(e.stack)); 

// map result of finding rows so that unnecessary info is removed 
function mapOut(object) {
    return object.map(i => i.dataValues);
}


//---------------------------------------------------  ROUTES  ---------------------------------------------------


// GET PAGE "HOME" ----------------------------------
app.get('/', function (req, res) {
	Message.findAll({order: [['id', 'DESC']]})
	.then( result => {
		const content = mapOut(result);
		res.render('index', { contributions: content});
	})
	.catch(e => console.error(e.stack));
}); 

//POST "NEW CONTRIBUTION" ----------------------------------
app.post('/contribute', function(req, res) {
	
	const img = req.body.image === 'nah, thanks.' ? 'nah, thanks.' : req.body.image + '.jpg';
	const newItem = [req.body.title, req.body.body, img];

	Message.create({
		title: req.body.title,
		body: req.body.body,
		image: img
	})
	.then(result => {
		res.redirect('/');
	})
	.catch(e => console.error(e.stack));
});

//POST "DELETE CONTRIBUTION" ----------------------------------
app.post('/delete', function(req, res) {

	const id = req.body.messageID;

	Message.findById(id)
	.then(message => {
		message.destroy();
	})
	.catch(e => console.error(e.stack))
});

//POST "EDIT CONTRIBUTION" ----------------------------------
app.post('/edit', function(req, res) {

	const id = req.body.id;

	Message.findById(id)
	.then(message => { message.update({ title: req.body.title, body: req.body.body }) 
	})
	.then(() => {
		setTimeout(() => { 
			res.redirect('/'); 
		}, 2000);
	})
	.catch(e => console.error(e.stack))
});

//GET "SPECIFIC CONTRIBUTION" ----------------------------------
app.get('/search', function(req,res) {
	const id = req.query.messageID;

	Message.findById(id)
	.then( result => {
		const content = {
			title: result.title,
			body: result.body
		};
		res.send({ contentEdit: content });
	})
	.catch(e => console.error(e.stack));
})




