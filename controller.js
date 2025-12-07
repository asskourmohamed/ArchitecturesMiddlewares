const express          = require("express");
const path             = require("path");
const bodyParser       = require("body-parser");
const session          = require('express-session');
const passport         = require('passport');
const guiManager       = require('./guiManager');
const securityManager  = require('./securityManager');
const { TodoListSingleton } = require('./db');

var app = express();

app.listen(3000, function(){
  console.log("Server is running http://localhost:3000");
});

// Initialiser la liste Todo (Singleton)
const todoList = TodoListSingleton.getTodoListInstance();

securityManager.initializePassport(passport);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'./')));
app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour vérifier l'authentification
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/userLogin');
}

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, guiManager.renderHtmlHomePage()));
});

// Route de connexion (GET)
app.get('/userLogin', (req, res) => {
  res.sendFile(path.join(__dirname, guiManager.renderHtmlAuthenticationPage()));
});

// Route de connexion (POST)
app.post('/userLogin',
  passport.authenticate('local', { 
    failureRedirect: '/userLogin', 
    successRedirect: '/loginSuccess', 
    failureFlash: false 
  })
);

// Succès de connexion
app.get('/loginSuccess', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, guiManager.renderHtmlMainPage()));
});

// Déconnexion
app.post('/userLogout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// À propos
app.post('/userAbout', (req, res) => {
  res.send(guiManager.renderHtmlAboutPage());
});

// Inscription
app.post('/userRegister', (req, res) => {
  res.send(guiManager.renderHtmlRegistrationPage());
});

// Annuler (depuis login)
app.get('/userCancel', (req, res) => {
  res.redirect('/');
});

app.post('/userCancel', function(req, res){
  res.sendFile(path.join(__dirname, guiManager.renderHtmlHomePage()));
});

// ========== ROUTES TODO ==========

// Afficher la liste des todos
app.post('/todoListRequest', isAuthenticated, (req, res) => {
  const todos = todoList.getAllTodos();
  const stats = todoList.getTodoCount();
  res.send(guiManager.renderHtmlTodoListPage(todos, stats));
});

// Ajouter un nouveau todo
app.post('/addTodoRequest', isAuthenticated, (req, res) => {
  res.send(guiManager.renderHtmlAddTodoPage());
});

// Créer un nouveau todo (POST du formulaire)
app.post('/createTodo', isAuthenticated, (req, res) => {
  const todoText = req.body.todoText;
  const result = todoList.addTodo(todoText);
  
  if (result.success) {
    res.redirect('/todoListRequestGet');
  } else {
    res.send(guiManager.renderHtmlAddTodoPage(result.message));
  }
});

// Afficher liste todos (GET pour redirection)
app.get('/todoListRequestGet', isAuthenticated, (req, res) => {
  const todos = todoList.getAllTodos();
  const stats = todoList.getTodoCount();
  res.send(guiManager.renderHtmlTodoListPage(todos, stats));
});

// Marquer un todo comme complété/non complété
app.post('/toggleTodo/:id', isAuthenticated, (req, res) => {
  const todoId = req.params.id;
  todoList.toggleTodo(todoId);
  res.redirect('/todoListRequestGet');
});

// Supprimer un todo
app.post('/deleteTodo/:id', isAuthenticated, (req, res) => {
  const todoId = req.params.id;
  todoList.deleteTodo(todoId);
  res.redirect('/todoListRequestGet');
});

// Modifier un todo (afficher formulaire)
app.post('/editTodo/:id', isAuthenticated, (req, res) => {
  const todoId = req.params.id;
  const result = todoList.getTodo(todoId);
  
  if (result.success) {
    res.send(guiManager.renderHtmlEditTodoPage(result.todo));
  } else {
    res.redirect('/todoListRequestGet');
  }
});

// Mettre à jour un todo (POST du formulaire)
app.post('/updateTodo/:id', isAuthenticated, (req, res) => {
  const todoId = req.params.id;
  const newText = req.body.todoText;
  todoList.modifyTodo(todoId, newText);
  res.redirect('/todoListRequestGet');
});

// Supprimer tous les todos
app.post('/deleteAllTodos', isAuthenticated, (req, res) => {
  todoList.deleteAllTodos();
  res.redirect('/todoListRequestGet');
});

// Annuler et retourner à la page principale
app.post('/cancelRequest', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, guiManager.renderHtmlMainPage()));
});