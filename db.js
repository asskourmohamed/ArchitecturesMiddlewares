class TodoListSingleton {
  static todoListInstance = null;
  
  constructor() {
    this.todos = [
      { id: 1, text: "Apprendre Node.js", completed: false },
      { id: 2, text: "Créer une application web", completed: false },
      { id: 3, text: "Sécuriser l'authentification", completed: true }
    ];
    this.nextId = 4; 
  }
  
  static getTodoListInstance() {
    if (!TodoListSingleton.todoListInstance) {
      TodoListSingleton.todoListInstance = new TodoListSingleton();
    }
    return TodoListSingleton.todoListInstance;
  }
  
  // Ajouter un nouveau todo
  addTodo(text) {
    if (!text || text.trim() === '') {
      return { success: false, message: 'Le texte du todo ne peut pas être vide' };
    }
    
    const newTodo = {
      id: this.nextId++,
      text: text.trim(),
      completed: false
    };
       
    this.todos.push(newTodo);
    return { success: true, todo: newTodo };
  }

  // Récupérer un todo par ID
  getTodo(id) {
    const todo = this.todos.find(t => t.id === parseInt(id));
    if (!todo) {
      return { success: false, message: 'Todo non trouvé' };
    }
    return { success: true, todo: todo };
  }

  // Récupérer tous les todos
  getAllTodos() {
    return this.todos;
  }

  // Modifier un todo
  modifyTodo(id, newText, completed) {
    const todoIndex = this.todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      return { success: false, message: 'Todo non trouvé' };
    }
    
    if (newText !== undefined && newText.trim() !== '') {
      this.todos[todoIndex].text = newText.trim();
    }
    
    if (completed !== undefined) {
      this.todos[todoIndex].completed = completed;
    }
    
    return { success: true, todo: this.todos[todoIndex] };
  }

  // Marquer un todo comme complété/non complété
  toggleTodo(id) {
    const todoIndex = this.todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      return { success: false, message: 'Todo non trouvé' };
    }
    
    this.todos[todoIndex].completed = !this.todos[todoIndex].completed;
    return { success: true, todo: this.todos[todoIndex] };
  }

  // Supprimer un todo
  deleteTodo(id) {
    const todoIndex = this.todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      return { success: false, message: 'Todo non trouvé' };
    }
    
    const deletedTodo = this.todos.splice(todoIndex, 1)[0];
    return { success: true, todo: deletedTodo };
  }

  // Supprimer tous les todos
  deleteAllTodos() {
    const count = this.todos.length;
    this.todos = [];
    return { success: true, count: count };
  }

  // Compter les todos
  getTodoCount() {
    return {
      total: this.todos.length,
      completed: this.todos.filter(t => t.completed).length,
      pending: this.todos.filter(t => !t.completed).length
    };
  }

}//End TodoListSingleton Class

module.exports = { TodoListSingleton };