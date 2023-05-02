import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

import * as SupabaseSupabaseJs from "https://cdn.skypack.dev/@supabase/supabase-js@2.10.0";
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://eggtdvvjoksncmdbxgsz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZ3RkdnZqb2tzbmNtZGJ4Z3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgxNjE4MDgsImV4cCI6MTk5MzczNzgwOH0.1PNSCvjCrAqMEUPXpPX6qwZCqTRexjWZuhIzSZeorK0'
const supabase = createClient(supabaseUrl, supabaseKey)


let CurrentUserName = ""

function Todo({ todo, index, compeleteTodo, unCompeleteTodo, removeTodo }) {
  return <div class='todo-item  animate__bounceIn' style={{ textDecoration: todo.isCompleted ? 'line-through' : '' }}>
    <div class='todo-item-content'>{todo.text}</div>
    <div>
      <button onClick={() => { compeleteTodo(index) }}>Done</button>
      <button onClick={() => { unCompeleteTodo(index) }}>Undone</button>
      <button onClick={() => { removeTodo(index) }}>X</button>
    </div>
  </div>

}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState('')
  const handleSubmit = e => {
    e.preventDefault();
    if(!value)return
    addTodo(value);
    setValue('')
  }
  return <form onSubmit={handleSubmit}>
    <input type="text" className='todo-input' style={{ display: 'none' }} placeholder='add todo ...' value={value} onChange={e => setValue(e.target.value)} />
  </form>
}

function UserName({ addTodo}) {
  const [value, setValue] = useState('')

  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { data: todolist, error } = await supabase.from('todolist').select('*');
      if (error) {
        console.error(error);
      } else {
        setData(todolist);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    CurrentUserName = value
    document.getElementsByClassName('username-input')[0].style.display = 'none'
    document.getElementsByClassName('todo-input')[0].style.display = 'block'
    
    let username = new Array()
    let tododata = new Array()
    {data.map(user => {
      const name = user.userName
      username.push(name)// 将user.id赋值给userId变量
      const things = user.things
      tododata.push(things)
    })}

    const newTodos = [];
    for(let i =0;i<username.length;i++){
      if(username[i]==CurrentUserName){
        newTodos.push(tododata[i]);  
      }
    }
    addTodo(newTodos);
    setValue('')
  }
  return <form onSubmit={handleSubmit}>
    <input type="text" className='username-input' placeholder='your Name' value={value} onChange={e => setValue(e.target.value)} />
  </form>
}

function App() {
  const [todos, setTodos] = useState([
    { text: 'Enter a nickname to save your todo list!', isCompleted: false }
  ])
  
  const addTodo = text => {
    for (let i = 0; i < todos.length; i++) {
      if (text == todos[i].text) {
        animateCSS(document.querySelector('.todo-list input'), 'jello')
        document.querySelector('.todo-list input').placeholder = 'Repeat!'
        setTimeout(function () {
          document.querySelector('.todo-list input').placeholder = 'add todo ...'
        }, 1000);
        return
      }
    }
    const newTodos = [...todos]
    for(let i =0;i<text.length;i++){
      const content=text[i]
      newTodos.push({text:content,isCompleted: false})
    }
    setTodos(newTodos)
    console.log(newTodos)
    
  }
  const compeleteTodo = index => {
    const newTodos = [...todos]
    if (newTodos[index].isCompleted != true) {
      newTodos[index].isCompleted = true;
      let todoitem = document.querySelectorAll('.todo-item-content')
      animateCSS(todoitem[index], 'tada')
    }
    setTodos(newTodos)
  }
  const unCompeleteTodo = index => {
    const newTodos = [...todos]
    if (newTodos[index].isCompleted == true) {
      newTodos[index].isCompleted = false;
      let todoitem = document.querySelectorAll('.todo-item-content')
      animateCSS(todoitem[index], 'tada')
    }
    setTodos(newTodos)
  }
  const removeTodo = index => {
    const newTodos = [...todos]
    let todoitem = document.querySelectorAll('.todo-item')
    todoitem[index].classList.add("animate__bounceOut")
    setTimeout(function () {
      newTodos.splice(index, 1)
      setTodos(newTodos)
    }, 700);

  }

  const animateCSS = (node, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;

      node.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

  return (
    <div className="App">

      <h1>TodoList</h1>
      <div className="todo-list">
        {
          todos.map((todo, index) => { return <Todo key={index} todo={todo} index={index} compeleteTodo={compeleteTodo} unCompeleteTodo={unCompeleteTodo} removeTodo={removeTodo}></Todo> })
        }
        <TodoForm addTodo={addTodo}></TodoForm>
        <UserName addTodo={addTodo} removeTodo={setTodos}></UserName>
      </div>

    </div>
  );
}

export default App;
