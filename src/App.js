import './App.css';
import React, { useState, useEffect } from 'react';
import 'animate.css'

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
    if (!value) return
    addTodo(value);
    setValue('')
  }
  return <form onSubmit={handleSubmit}>
    <input type="text" className='todo-input' style={{ display: 'none' }} placeholder='add todo ...' value={value} onChange={e => setValue(e.target.value)} />
  </form>
}

function UserName({ addTodo, removeTodo }) {
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


    let username = []
    let tododata = []
    let todoid = []
    let isCompletedlist = []
    data.map(user => {
      username.push(user.userName)// 将user.id赋值给userId变量
      tododata.push(user.todo)
      isCompletedlist.push(user.iscompleted)
      todoid.push(user.id)
      return null
    })



    let newTodos = [];
    for (let i = 0; i < username.length; i++) {
      if (username[i] === CurrentUserName) {
        const text = tododata[i]
        const id = todoid[i]
        const isCompleted = isCompletedlist[i]
        newTodos.push({ text: text, isCompleted: isCompleted, id: id });
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
  const [todos, setTodos] = useState([])

  const addTodo = async text => {

    for (let i = 0; i < todos.length; i++) {
      if (text === todos[i].text) {
        animateCSS(document.querySelector('.todo-list input'), 'jello')
        document.querySelector('.todo-list input').placeholder = 'Repeat!'
        setTimeout(function () {
          document.querySelector('.todo-list input').placeholder = 'add todo ...'
        }, 1000);
        return
      }
    }
    let newTodos = [...todos]

    if (Array.isArray(text) === true) {

      for (let i = 0; i < text.length; i++) {

        const content = text[i].text
        newTodos.push({ text: content, id: text[i].id , isCompleted:text[i].isCompleted })
        console.log(newTodos)
      }
    }
    else {
      const id = todos.length + 1
      newTodos.push({ text, isCompleted: false, id: text.id })
      const { data, error } = await supabase.from('todolist').insert([{ userName: CurrentUserName, todo: text, iscompleted: false }]);
      if (error) {
        console.error(error);
        return;
      }
    }

    setTodos(newTodos)

  }


  const compeleteTodo = async index => {
    const newTodos = [...todos]
    if (newTodos[index].isCompleted !== true) {
      newTodos[index].isCompleted = true;
      let todoitem = document.querySelectorAll('.todo-item-content')
      animateCSS(todoitem[index], 'tada')

      const { data, error } = await supabase
        .from('todolist')
        .update({ iscompleted: true })
        .eq('id', todos[index].id)
      if (error) {
        console.error(error);
        return;
      }
    }
    setTodos(newTodos)
  }
  const unCompeleteTodo = async index => {
    const newTodos = [...todos]
    if (newTodos[index].isCompleted === true) {
      newTodos[index].isCompleted = false;
      let todoitem = document.querySelectorAll('.todo-item-content')
      animateCSS(todoitem[index], 'tada')

      const { data, error } = await supabase
        .from('todolist')
        .update({ iscompleted: false })
        .eq('id', todos[index].id)
      if (error) {
        console.error(error);
        return;
      }
    }
    setTodos(newTodos)
  }


  const removeTodo = async index => {
    const newTodos = [...todos]
    let todoitem = document.querySelectorAll('.todo-item')
    todoitem[index].classList.add("animate__bounceOut")
    setTimeout(function () {
      newTodos.splice(index, 1)
      setTodos(newTodos)
    }, 700);
    const { data, error } = await supabase
      .from('todolist')
      .delete()
      .match({ id: todos[index].id });
    if (error) {
      console.error(error);
      return;
    }
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

      <h1 onClick={() => window.location.reload()}>TodoList</h1>
      <div className="todo-list">
        {
          todos.map((todo, index) => { return <Todo key={index} todo={todo} index={index} compeleteTodo={compeleteTodo} unCompeleteTodo={unCompeleteTodo} removeTodo={removeTodo}></Todo> })
        }
        <TodoForm addTodo={addTodo}></TodoForm>
        <UserName addTodo={addTodo} removeTodo={removeTodo}></UserName>
      </div>

    </div>
  );
}

export default App;
