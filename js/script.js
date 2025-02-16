'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
        this.createItem = this.createItem.bind(this);
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.setAttribute('data-key', todo.key);

        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }


    deleteItem(key) {
        this.todoData.delete(key);
        this.render();
    }

    completedItem(key) {
        const item = this.todoData.get(key);
        item.completed = !item.completed;
        this.render();
    }

    handler() {
        const todoContainer = document.querySelector('.todo-container');

        todoContainer.addEventListener('click', (event) => {
            const target = event.target;
            console.log(target);
            if (target.classList.contains('todo-remove')) {
                this.deleteItem(target.parentElement.parentElement.getAttribute('data-key'));
                this.deleteItem(target.parentElement.parentElement.key);
            } else if (target.classList.contains('todo-complete')) {
                this.completedItem(target.parentElement.parentElement.getAttribute('data-key'));
                this.completedItem(target.parentElement.parentElement.key);
            }
        });
    }
    init() {
        this.handler();
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
