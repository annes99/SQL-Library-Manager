var express = require('express');
var router = express.Router();
var Book = require("../models").Book;


// get / - Shows the full list of books.
router.get('/', function(req, res, next) {
  Book.findAll().then(function(books){
      res.render('index', {books: books, title: 'Welcome to Online Library'});
  }).catch(function(error){
    res.status(500).send(error);
  });
});

// get /books/new - Shows the create new book form.
router.get('/new', function(req, res, next) {
  res.render('new-book', {title: 'New Book'});
});

// get /books/:id - Shows book detail form.
router.get('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      res.render('update-book', {book: book, title: 'Update Book'});
    } else {
      const err = new Error('Server error');
      err.status = 500;
      res.render('error', {error: err, title: 'Server error'});
    }
  }).catch(function(error){
    res.status(500).send(error);
  });
});


// post /books/new - Posts a new book to the database.
router.post('/new', function(req, res, next) {
  Book.create(req.body).then(function(book) {
    res.redirect('/');
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render('new-book', {book: Book.build(req.body), errors: error.errors, title: 'New Book'});
      } else {
        throw error;
      }
  }).catch(function(error){
    res.status(500).send(error);
  });
});

// post /books/:id - Updates book info in the database.
router.post("/:id", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book) {
      return book.update(req.body);
    } else {
      res.sendStatus(404); 
    }
  }).then(function(book){
    res.redirect("/");        
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        const book = Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', {book: book, errors: error.errors, title: 'Update Book'});
      } else {
        throw error;
      }
  }).catch(function(error){
    res.status(500).send(error);
   });
});




// post /books/:id/delete - Deletes a book.
router.post("/:id/delete", function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){  
    if(book) {
      return book.destroy();
    } else {
      res.sendStatus(404);
    }
  }).then(function(){
    res.redirect("/");    
  }).catch(function(error){
    res.status(500).send(error);
   });
});

module.exports = router;
