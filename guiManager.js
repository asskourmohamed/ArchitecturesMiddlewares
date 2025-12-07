function renderHtmlHomePage() {
  return "./homePage.html";
}

function renderHtmlAuthenticationPage() {
  return "./authenticationPage.html";
}

function renderHtmlMainPage() {
  return "./mainPage.html";
}

// Page pour afficher la liste des todos
function renderHtmlTodoListPage(todos, stats) {
  var responseHtml = `<!DOCTYPE html> 
    <style> 
      body {background-color: #f0f0f0; font-family: Arial, sans-serif; padding: 20px;}
      h2 {color: #333;}
      h3 {color: #0066cc;}
      .container {max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);}
      .stats {background: #e3f2fd; padding: 10px; border-radius: 5px; margin-bottom: 20px;}
      .todo-item {
        background: #fafafa;
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
        border-left: 4px solid #0066cc;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .todo-item.completed {
        background: #e8f5e9;
        border-left-color: #4caf50;
        opacity: 0.7;
      }
      .todo-text {flex-grow: 1; padding-right: 10px;}
      .todo-text.completed {text-decoration: line-through; color: #666;}
      .todo-actions {display: flex; gap: 5px;}
      .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 8px 16px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s;
      }
      .button:hover {background-color: #45a049;}
      .button-small {padding: 5px 10px; font-size: 12px;}
      .button-danger {background-color: #f44336;}
      .button-danger:hover {background-color: #da190b;}
      .button-warning {background-color: #ff9800;}
      .button-warning:hover {background-color: #e68900;}
      .button-secondary {background-color: #2196F3;}
      .button-secondary:hover {background-color: #0b7dda;}
    </style>
    <head><title>SUD312 - Todo List</title></head>
    <body>
      <div class="container">
        <header>
          <h2> My list</h2>
        </header>`;

  // Statistiques
  if (stats) {
    responseHtml += `
      <div class="stats">
        <strong> Statistiques :</strong> 
        Total: ${stats.total} | 
        Terminées: ${stats.completed} | 
        En cours: ${stats.pending}
      </div>`;
  }

  // Liste des todos
  if (todos.length === 0) {
    responseHtml += `<p style="text-align: center; color: #999; padding: 40px;">
      Aucune tâche. Commencez par en ajouter une ! </p>`;
  } else {
    todos.forEach(todo => {
      const completedClass = todo.completed ? 'completed' : '';
      const completedIcon = todo.completed ? '✅' : '⏳';
      
      responseHtml += `
        <div class="todo-item ${completedClass}">
          <div class="todo-text ${completedClass}">
            ${completedIcon} ${todo.text}
          </div>
          <div class="todo-actions">
            <form method="post" style="display: inline;">
              <button class="button button-small button-secondary" 
                      type="submit" formaction="/toggleTodo/${todo.id}">
                ${todo.completed ? ' Réactiver' : ' Terminer'}
              </button>
            </form>
            <form method="post" style="display: inline;">
              <button class="button button-small button-warning" 
                      type="submit" formaction="/editTodo/${todo.id}">
                 Modifier
              </button>
            </form>
            <form method="post" style="display: inline;">
              <button class="button button-small button-danger" 
                      type="submit" formaction="/deleteTodo/${todo.id}"
                      onclick="return confirm('Supprimer cette tâche ?')">
                 Supprimer
              </button>
            </form>
          </div>
        </div>`;
    });
  }

  // Boutons d'action
  responseHtml += `
    <div style="margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px;">
      <form method="post">
        <button class="button" type="submit" formaction="/addTodoRequest">
          Ajouter une tâche
        </button>
        <button class="button button-secondary" type="submit" formaction="/cancelRequest">
          Menu Principal
        </button>`;
  
  if (todos.length > 0) {
    responseHtml += `
        <button class="button button-danger" type="submit" formaction="/deleteAllTodos"
                onclick="return confirm('Supprimer TOUTES les tâches ?')">
           Tout Supprimer
        </button>`;
  }
  
  responseHtml += `
      </form>
    </div>
  </div>
</body>
</html>`;

  return responseHtml;
}

// Page pour ajouter un todo
function renderHtmlAddTodoPage(errorMessage) {
  var responseHtml = `<!DOCTYPE html>
    <style>
      body {background-color: #f0f0f0; font-family: Arial, sans-serif; padding: 20px;}
      .container {max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);}
      h2 {color: #333;}
      .form-group {margin-bottom: 20px;}
      label {display: block; margin-bottom: 5px; font-weight: bold; color: #555;}
      input[type="text"], textarea {
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
      }
      textarea {min-height: 100px; font-family: Arial, sans-serif;}
      input[type="text"]:focus, textarea:focus {
        border-color: #4CAF50;
        outline: none;
      }
      .button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 12px 24px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
      }
      .button:hover {background-color: #45a049;}
      .button-secondary {background-color: #999;}
      .button-secondary:hover {background-color: #777;}
      .error {color: #f44336; padding: 10px; background: #ffebee; border-radius: 4px; margin-bottom: 15px;}
    </style>
    <head><title>Ajouter une tâche</title></head>
    <body>
      <div class="container">
        <h2> Ajouter une nouvelle tâche</h2>`;
  
  if (errorMessage) {
    responseHtml += `<div class="error">⚠️ ${errorMessage}</div>`;
  }
  
  responseHtml += `
        <form method="post" action="/createTodo">
          <div class="form-group">
            <label for="todoText">Description de la tâche :</label>
            <textarea name="todoText" id="todoText" required 
                      placeholder="Ex: Terminer le projet Node.js..."></textarea>
          </div>
          <button class="button" type="submit"> Ajouter</button>
          <button class="button button-secondary" type="submit" formaction="/cancelRequest">
             Annuler
          </button>
        </form>
      </div>
    </body>
  </html>`;
  
  return responseHtml;
}

// Page pour modifier un todo
function renderHtmlEditTodoPage(todo) {
  var responseHtml = `<!DOCTYPE html>
    <style>
      body {background-color: #f0f0f0; font-family: Arial, sans-serif; padding: 20px;}
      .container {max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);}
      h2 {color: #333;}
      .form-group {margin-bottom: 20px;}
      label {display: block; margin-bottom: 5px; font-weight: bold; color: #555;}
      textarea {
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        min-height: 100px;
        font-family: Arial, sans-serif;
        box-sizing: border-box;
      }
      textarea:focus {border-color: #ff9800; outline: none;}
      .button {
        background-color: #ff9800;
        border: none;
        color: white;
        padding: 12px 24px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
      }
      .button:hover {background-color: #e68900;}
      .button-secondary {background-color: #999;}
      .button-secondary:hover {background-color: #777;}
    </style>
    <head><title>Modifier une tâche</title></head>
    <body>
      <div class="container">
        <h2> Modifier la tâche</h2>
        <form method="post" action="/updateTodo/${todo.id}">
          <div class="form-group">
            <label for="todoText">Description :</label>
            <textarea name="todoText" id="todoText" required>${todo.text}</textarea>
          </div>
          <button class="button" type="submit"> Enregistrer</button>
          <button class="button button-secondary" type="submit" formaction="/todoListRequestGet">
             Annuler
          </button>
        </form>
      </div>
    </body>
  </html>`;
  
  return responseHtml;
}

function renderHtmlAboutPage() {
  var responseHtml = `<!DOCTYPE html> 
    <style> 
      body {background-color: silver;}
      h2 {color: black;}
      h3 {color: black;}
      p {color: black;}
      .button {
        background-color: green;
        border: none;
        color: beige;
        padding: 8px 38px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
      }
    </style>
    <head><title>SUD312 - À propos</title></head> 
    <body>
      <header><h1>Lab1.8: Experimenting Securing Applications in NodeJS</h1></header>
      <h2>Welcome! This application is about managing your tasks securely.</h2>
      <p> Authentification sécurisée avec bcrypt</p>
      <p> Gestion complète de todos</p>
      <p> Sessions sécurisées avec Passport.js</p>
      <a href="/userCancel">Go Home</a>
    </body>
  </html>`;
  
  return responseHtml;
}

function renderHtmlRegistrationPage() {
  var responseHtml = `<!DOCTYPE html>
    <style> 
      body {background-color: silver;}
      h2 {color: black;}
      .button {
        background-color: green;
        border: none;
        color: beige;
        padding: 8px 38px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
      }
    </style>
    <head><title>SUD312 - Inscription</title></head>
    <body>
      <header><h1>Lab1.8: Experimenting Securing Applications in NodeJS</h1></header>
      <h2>Welcome! Registration would be available soon...</h2>
      <a href="/userCancel">Go Home</a>
    </body>
  </html>`;
  
  return responseHtml;
}

module.exports = { 
  renderHtmlHomePage, 
  renderHtmlAboutPage, 
  renderHtmlAuthenticationPage,
  renderHtmlRegistrationPage, 
  renderHtmlMainPage,
  renderHtmlTodoListPage,
  renderHtmlAddTodoPage,
  renderHtmlEditTodoPage
};