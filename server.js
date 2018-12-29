
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { BlogPosts } = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
BlogPosts.create('First post', 'Hello world', 'author', '12-28-18');
BlogPosts.create('Second post', 'Hello, again', 'author', Date.now());
BlogPosts.create('Third post', 'Hello, yet again', 'author', Date.now());

// adding some recipes to `Recipes` so there's something
// to retrieve.
console.log(BlogPosts);

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post\`${req.params.id}\``);
  res.status(204).end();
});


// when new recipe added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
app.post('/recipes', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = Recipes.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});

/*app.delete('/recipes/:id', (req, requiredFields, res) => {
  const requiredFields = ['itemId'];
  for( let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

});

function requiredFields(req, res, next) {
  const field = req.params.id;
  const requiredFields = ['itemId'];
  for( let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
}
*/

app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
