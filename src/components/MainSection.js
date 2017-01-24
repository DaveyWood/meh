import React, { Component, PropTypes } from 'react'
import TodoItem from './TodoItem'
import Footer from './Footer'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
}

export default class MainSection extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    completeAll: PropTypes.func.isRequired,
    clearCompleted: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    editTodo: PropTypes.func.isRequired
  }

  state = { filter: SHOW_ALL }

  handleClearCompleted = () => {
    this.props.clearCompleted()
  }

  handleShow = filter => {
    this.setState({ filter })
  }

  renderToggleAll(completedCount) {
    const { todos, completeAll } = this.props
    if (todos.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.length}
               onChange={completeAll} />
      )
    }
  }

  renderFooter(completedCount) {
    const { todos } = this.props
    const { filter } = this.state
    const activeCount = todos.length - completedCount

    if (todos.length) {
      return (
        <Footer completedCount={completedCount}
                activeCount={activeCount}
                filter={filter}
                onClearCompleted={this.handleClearCompleted.bind(this)}
                onShow={this.handleShow.bind(this)} />
      )
    }
  }

  render() {
    const { todos, editTodo, completeTodo, deleteTodo } = this.props
    const { filter } = this.state

    const filteredTodos = todos.filter(TODO_FILTERS[filter])
    const completedCount = todos.reduce((count, todo) =>
      todo.completed ? count + 1 : count,
      0
    )

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todo={todo}
              completeTodo={completeTodo}
              deleteTodo={deleteTodo}
              editTodo={editTodo} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}
