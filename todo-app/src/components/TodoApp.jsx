import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Pencil, Trash2, Check, X } from 'lucide-react'

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const loadTodos = useCallback(() => {
    const storedTodos = localStorage.getItem('todos')
   
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos)
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos)
        }
      } catch (error) {
       
      }
    }
  }, [])

  useEffect(() => {
    
    loadTodos()
  }, [loadTodos])

  const saveTodos = useCallback((newTodos) => {
    
    try {
      localStorage.setItem('todos', JSON.stringify(newTodos));
      
    } catch (error) {
     
    }
  }, [])

  const addTodo = useCallback(() => {
    if (inputValue.trim() !== '') {
      const newTodo = { id: Date.now(), text: inputValue, completed: false }
      const updatedTodos = [...todos, newTodo]
      setTodos(updatedTodos)
      saveTodos(updatedTodos)
      setInputValue('')
    }
  }, [inputValue, todos, saveTodos])

  const deleteTodo = useCallback((id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
  }, [todos, saveTodos])

  const toggleComplete = useCallback((id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
  }, [todos, saveTodos])

  const startEditing = useCallback((id, text) => {
    setEditingId(id)
    setEditValue(text)
  }, [])

  const saveEdit = useCallback((id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, text: editValue } : todo
    )
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
    setEditingId(null)
    setEditValue('')
  }, [todos, editValue, saveTodos])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditValue('')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Todo App</h1>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a new todo"
            className="flex-grow"
          />
          <Button onClick={addTodo} className="whitespace-nowrap bg-blue-500 text-white hover:bg-blue-600">Add Todo</Button>
        </div>
        <AnimatePresence>
          {todos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-2"
            >
              <div className="flex items-center space-x-3 flex-grow">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleComplete(todo.id)}
                  className="w-5 h-5"
                />
                {editingId === todo.id ? (
                  <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-grow"
                  />
                ) : (
                  <span className={todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                    {todo.text}
                  </span>
                )}
              </div>
              <div className="flex space-x-1">
                {editingId === todo.id ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => saveEdit(todo.id)} className="p-1">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEdit} className="p-1">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => startEditing(todo.id, todo.text)} className="p-1">
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)} className="p-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}