import React from 'react';
import useViewModel from './viewModel';
import './TodoManager.css';
import add from '../icons/add.svg';
import remove from '../icons/remove.svg';
import edit from '../icons/edit.svg';
import done from '../icons/done.svg';
import close from '../icons/close.svg';

const TodoManager: React.FC = () => {
  const viewModel = useViewModel();

  return (

    <div className='todoAppWrapper'>
      <h1>todo list</h1>
      <div>
        {viewModel.state.error && <div className="error">{viewModel.state.error}</div>}
      </div>
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

        <button className='addTodoButton' onClick={viewModel.handleAddTodo}>
          <img className='addIcon' src={add} alt={'add a new todo'} />
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
            All Complete
          </button>
        </div>
        <button className='deleteAllCompletedButton' onClick={viewModel.handleDeleteCompleted}>
          <img className='deleteIcon' src={remove} alt={'remove all completed todos'} />
        </button>
      </div>
      <p>
        {viewModel.countCompletedTodos()} of {viewModel.state.todos.length} todos completed
      </p>
      <ul>
        {viewModel.filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => viewModel.handleToggleComplete(todo.id)}
            />
            {viewModel.state.editingTaskId === todo.id ? (
              <>
                <input
                  type="text"
                  value={viewModel.state.editingTaskId === todo.id ? viewModel.state.editedText : todo.text}
                  onChange={(e) => viewModel.handleInlineEditInputChange(e.target.value)}
                />
                <button onClick={() => viewModel.handleInlineSave(todo.id)}>
                  <img className='saveIcon' src={done} alt={'save edited todo'} />
                </button>
                <button onClick={viewModel.handleInlineCancel}>
                  <img className='cancelIcon' src={close} alt={'cancel editing todo'} />
                </button>
              </>
            ) : (
              <>
                {todo.completed ? <del>{todo.text}</del> : <span>{todo.text}</span>}
                <button onClick={() => viewModel.handleInlineEdit(todo.id, todo.text)}>
                  <img className='editIcon' src={edit} alt={'edit todo'} />
                </button>
                {!viewModel.state.editingTaskId && (
                  <button onClick={() => viewModel.handleDeleteTodo(todo.id)}>
                    <img className='deleteIconSmall' src={remove} alt={'delete todo'} />
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoManager;
