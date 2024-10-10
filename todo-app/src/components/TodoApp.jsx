import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Trash2, Edit2, Check, X } from 'lucide-react'

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }])
      setInputValue('')
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditValue(text)
  }

  const saveEdit = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editValue } : todo
    ))
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Todo App</h1>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a new todo"
            className="flex-grow"
          />
          <Button onClick={addTodo}>Add Todo</Button>
        </div>
        <AnimatePresence>
          {todos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-2"
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
                  <span className={`flex-grow ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {editingId === todo.id ? (
                  <>
                    <Button variant="outline" size="icon" onClick={() => saveEdit(todo.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="icon" onClick={() => startEditing(todo.id, todo.text)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="destructive" size="icon" onClick={() => deleteTodo(todo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}