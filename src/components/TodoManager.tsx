import React from 'react'
import useViewModel from './viewModel'
import './TodoManager.css'
import add from '../icons/add.svg'
import remove from '../icons/remove.svg'
import edit from '../icons/edit.svg'
import done from '../icons/done.svg'
import done_all from '../icons/done_all.svg'
import close from '../icons/close.svg'

const TodoManager: React.FC = () => {
  const viewModel = useViewModel()

  return (
    <div className='todoAppWrapper'>
      <h1>todo list</h1>
      <div className='inputFieldContainer'>
        <div className='inputFieldContainerLeft'>
          <input
            className='inputField'
            type="text"
            placeholder="Enter a todo"
            value={viewModel.state.inputText}
            onChange={(e) => viewModel.handleInputChange(e.target.value)}
          />
        </div>
        <button className='addRemoveButtonBig' onClick={viewModel.handleAddTodo}>
          <img className='buttonIconBig' src={add} alt={'add a new todo'} />
        </button>
      </div>
      <div className='optionsContainer'>
        <div className='optionsContainerLeft'>
          <select
            className='todoFilter'
            value={viewModel.state.filterOption}
            onChange={(e) => viewModel.handleFilterChange(e.target.value)}
          >
            <option value="all">All todos</option>
            <option value="completed">Completed todos</option>
            <option value="incomplete">Incomplete todos</option>
          </select>
          <button className='allCompletedButton' onClick={viewModel.handleToggleAllComplete}>
            <img className='buttonIconBig' src={done_all} alt={'completed all todos'} />
          </button>
        </div>
        <button className='addRemoveButtonBig' onClick={viewModel.handleDeleteCompleted}>
          <img className='buttonIconBig' src={remove} alt={'remove all completed todos'} />
        </button>
      </div>
      <div className='statusContainer'>
        {viewModel.state.error && <div className="errorMessage">{viewModel.state.error}</div>}
        {viewModel.state.loading &&
          <>
            Loading your todos...
            <div className='spinnerContainer'>
              <div className="spinner"></div >
            </div>
          </>}
        {!viewModel.state.loading && !viewModel.state.error && (
          <>
            {viewModel.state.todos.length === 0 ? (
              'You have nothing to do yet :)'
            ) : (
              <>
                {viewModel.countCompletedTodos()} of {viewModel.state.todos.length}{' '}
                {viewModel.state.todos.length === 1 ? 'todo' : 'todos'} completed
              </>
            )}
          </>
        )}
      </div>
      <ul className='todoItemList'>
        {viewModel.filteredTodos.map((todo) => (
          <li className='todoItem' key={todo.id}>
            <div className="todoItemLeft">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => viewModel.handleToggleComplete(todo.id)}
              />
              {viewModel.state.editingTaskId === todo.id ? (
                <input
                  type="text"
                  value={viewModel.state.editedText}
                  onChange={(e) => viewModel.handleInlineEditInputChange(e.target.value)}
                />
              ) : (
                <span>{todo.completed ? <del>{todo.text}</del> : <span>{todo.text}</span>}</span>
              )}
            </div>
            <div className="todoItemRight">
              {viewModel.state.editingTaskId === todo.id ? (
                <>
                  <button className='inlineEditButton' onClick={() => viewModel.handleInlineSave(todo.id)}>
                    <img className='inlineEditIconSmall' src={done} alt={'save edited todo'} />
                  </button>
                  <button className='inlineEditButton' onClick={viewModel.handleInlineCancel}>
                    <img className='inlineEditIconSmall' src={close} alt={'cancel editing todo'} />
                  </button>
                </>
              ) : (
                <>
                  <button className='inlineEditButton' onClick={() => viewModel.handleInlineEdit(todo.id, todo.text)}>
                    <img className='inlineEditIconSmall' src={edit} alt={'edit todo'} />
                  </button>
                  {viewModel.state.editingTaskId !== todo.id && (
                    <button className='inlineEditButton' onClick={() => viewModel.handleDeleteTodo(todo.id)}>
                      <img className='inlineEditIconSmall' src={remove} alt={'delete todo'} />
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoManager
