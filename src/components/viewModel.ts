import { useState, useEffect } from 'react'
import axios from 'axios'

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface State {
  todos: Todo[]
  inputText: string
  filterOption: string
  editingTaskId: string | null
  editedText: string
  error: string | null
  loading: boolean 
}

const useViewModel = () => {
  const [state, setState] = useState<State>({
    todos: [],
    inputText: '',
    filterOption: 'all',
    editingTaskId: null,
    editedText: '',
    error: null,
    loading: false,
  })

  const apiUrl = 'http://localhost:8080'

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    setState((prevState) => ({ ...prevState, loading: true })) 
    try {
      const response = await axios.get(`${apiUrl}/tasks`)
      const fetchedTodos: Todo[] = response.data
      setState((prevState) => ({ ...prevState, todos: fetchedTodos, error: null }))
    } catch (error) {
      const errorMessage = 'Cannot load your todos. Please try again.'
      console.error(errorMessage)
      setState((prevState) => ({ ...prevState, error: errorMessage }))
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }))
    }
  }

  const handleInputChange = (inputText: string) => {
    setState((prevState) => ({ ...prevState, inputText }))
  }

  const handleAddTodo = async () => {
    if (state.inputText.trim() !== '') {
      const newTodoText = state.inputText
      try {
        const response = await axios.post(`${apiUrl}/tasks`, { text: newTodoText })
        const newTodo: Todo = response.data
        setState((prevState) => ({ 
          ...prevState, 
          todos: [newTodo, ...prevState.todos], 
          inputText: '',
          error: null 
        }))
      } catch (error) {
        const errorMessage = 'Cannot add your todo. Please try again.'
        console.error(errorMessage)
        setState((prevState) => ({ ...prevState, error: errorMessage }))
      }
    }
  }
  
  const handleEditTodo = async (id: string, newText: string) => {
    try {
      const response = await axios.post(`${apiUrl}/tasks/${id}`, { text: newText })
      const updatedTodo: Todo = response.data
      setState((prevState) => ({
        ...prevState,
        todos: prevState.todos.map((todo) =>
          todo.id === id ? { ...todo, text: updatedTodo.text } : todo
        ),
        error: null,
      }))
    } catch (error) {
      const errorMessage = 'Cannot edit your todo. Please try again.'
      console.error(errorMessage)
      setState((prevState) => ({ ...prevState, error: errorMessage }))
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`)
      setState((prevState) => ({ ...prevState, todos: prevState.todos.filter((todo) => todo.id !== id), error: null }))
    } catch (error) {
      const errorMessage = 'Cannot delete your todo. Please try again.'
      console.error(errorMessage)
      setState((prevState) => ({ ...prevState, error: errorMessage }))
    }
  }

  const handleToggleComplete = async (id: string) => {
    const todoToToggle = state.todos.find(todo => todo.id === id)
    if (!todoToToggle) {
      console.error('Todo not found')
      return
    }
    try {
      if (todoToToggle.completed) {
        const response = await axios.post(`${apiUrl}/tasks/${id}/incomplete`)
        const updatedTodo: Todo = response.data
        setState(prevState => ({
          ...prevState,
          todos: prevState.todos.map(todo =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          ),
          error: null,
        }))
      } else {
        const response = await axios.post(`${apiUrl}/tasks/${id}/complete`)
        const updatedTodo: Todo = response.data
        setState(prevState => ({
          ...prevState,
          todos: prevState.todos.map(todo =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          ),
          error: null,
        }))
      }
    } catch (error) {
      const errorMessage = 'Cannot tick your todo. Please try again.'
      console.error(errorMessage)
      setState((prevState) => ({ ...prevState, error: errorMessage }))
    }
  }
  
  const handleToggleAllComplete = async () => {
    try {
      const updatedTodos: Todo[] = []
      for (const todo of state.todos) {
        if (!todo.completed) {
          const response = await axios.post(`${apiUrl}/tasks/${todo.id}/complete`)
          updatedTodos.push(response.data)
        } else {
          updatedTodos.push(todo)
        }
      }
      setState((prevState) => ({ ...prevState, todos: updatedTodos, error: null }))
    } catch (error) {
      const errorMessage = 'Cannot tick all your todos. Please try again.'
      console.error(errorMessage)
      setState((prevState) => ({ ...prevState, error: errorMessage }))
    }
  }
  
  const handleDeleteCompleted = async () => {
    try {
      const completedTodos = state.todos.filter((todo) => todo.completed)
      await Promise.all(
        completedTodos.map(async (todo) => {
          await axios.delete(`${apiUrl}/tasks/${todo.id}`)
        })
      )
      setState((prevState) => ({
        ...prevState,
        todos: prevState.todos.filter((todo) => !todo.completed),
        error: null,
      }))
    } catch (error) {
      const errorMessage = 'Cannot delete your completed todos. Please try again.'
      console.error(errorMessage)
      setState((prevState) => ({ ...prevState, error: errorMessage }))
    }
  }
  
  const countCompletedTodos = () => {
    return state.todos.filter((todo) => todo.completed).length
  }

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filterOption === 'all') {
      return true
    } else if (state.filterOption === 'completed') {
      return todo.completed
    } else {
      return !todo.completed
    }
  })

  const handleFilterChange = (filterOption: string) => {
    setState((prevState) => ({ ...prevState, filterOption }))
  }

  const handleInlineEditInputChange = (editedText: string) => {
    setState((prevState) => ({ ...prevState, editedText }))
  }

  const handleInlineEdit = (todoId: string, currentText: string) => {
    setState((prevState) => ({ ...prevState, editingTaskId: todoId, editedText: currentText  }))
  }

  const handleInlineSave = (todoId: string) => {
    handleEditTodo(todoId, state.editedText)
    setState((prevState) => ({ ...prevState, editingTaskId: null, editedText: ''  }))
  }

  const handleInlineCancel = () => {
    setState((prevState) => ({ ...prevState, editingTaskId: null, editedText: ''  }))
  }

  return {
    state,
    handleInputChange,
    handleAddTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleToggleComplete,
    handleToggleAllComplete,
    handleDeleteCompleted,
    countCompletedTodos,
    filteredTodos,
    handleFilterChange,
    handleInlineEditInputChange,
    handleInlineEdit,
    handleInlineSave,
    handleInlineCancel
  }
}

export default useViewModel