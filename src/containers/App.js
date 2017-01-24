import React from 'react'
import Header from '../components/Header'
import MainSection from '../components/MainSection'

function makeAtom(initialValue) {
  let value = initialValue;
  let observers = [];

  return {
    setValue: (updateFunction) => {
      value = updateFunction(value);
      observers.forEach(o => o(value));
    },
    patchValue: (patch) => {
      if (typeof patch === 'function') {
        value = {
          ...value,
          ...patch(value)
        };
      }  else {
        value = {
          ...value,
          ...patch
        };
      }
      observers.forEach(o => o(value));
    },
    getValue: () => value,
    addObserver: newObserver => observers.push(newObserver),
    removeObserver: () => "not implemented"
  }

}
// TODO use local state on App? That would solve the singleton problem.
const applicationState = makeAtom({
  todos: [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }],
  counter: 1
});

function addTodo(text) {
  applicationState.patchValue(state => {
    return {
      todos: [...state.todos, {
        text,
        completed: false,
        id: state.counter
      }],
      counter: state.counter + 1
    }

  });
}

function updateCompletedTodo(id, state) {
  const newTodos = [];
  for (var todo of state.todos) {
    if (todo.id === id) {
      newTodos.push({
        ...todo,
        completed: !todo.completed
      })
    } else {
      newTodos.push(todo);
    }
  }
  return {todos: newTodos };
}

function completeTodo(id) {
  applicationState.patchValue(state => updateCompletedTodo(id, state));
}

function updateTodoText(id, text, state) {
  const newTodos = [];
  for (var todo of state.todos) {
    if (todo.id === id) {
      newTodos.push({
        ...todo,
        text
      })
    } else {
      newTodos.push(todo);
    }
  }
  return {todos: newTodos };
}

function editTodoText(id, text) {
  applicationState.patchValue(state => updateTodoText(id, text, state));
}

function completeAll() {
  const allMarked = applicationState.getValue().todos.every(t => t.completed);
  const newTodos = applicationState.getValue().todos.map(t => { return {...t, completed: !allMarked}});
  applicationState.patchValue({ todos: newTodos });
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    applicationState.addObserver(val => this.setState({todos: val.todos}));
    this.state = { todos: applicationState.getValue().todos };
  }

  render() {
    const todos = this.state.todos;
    return (
      <div>
        <Header addTodo={addTodo} />
        <MainSection todos={todos} 
          clearCompleted={() => applicationState.patchValue({todos: applicationState.getValue().todos.filter(t => !t.completed)}) }
          completeAll={completeAll}
          completeTodo={ completeTodo } 
          deleteTodo={id => applicationState.patchValue({todos: applicationState.getValue().todos.filter(t => t.id !== id)}) } 
          editTodo={editTodoText}/>
      </div>
    );
  }
}


