// Simple Todo app - stores items in localStorage
const STORAGE_KEY = 'todolist.items'

const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const clearCompletedBtn = document.getElementById('clear-completed')
const clearAllBtn = document.getElementById('clear-all')

let items = loadItems()
render()

form.addEventListener('submit', e => {
  e.preventDefault()
  const text = input.value.trim()
  if(!text) return
  const item = { id: cryptoRandomId(), text, done:false, created: Date.now() }
  items.unshift(item)
  saveItems()
  input.value = ''
  render()
})

list.addEventListener('click', e => {
  const id = e.target.closest('[data-id]')?.dataset.id
  if(!id) return
  if(e.target.matches('.toggle')){
    toggleItem(id)
  } else if(e.target.matches('.delete')){
    deleteItem(id)
  }
})

clearCompletedBtn.addEventListener('click', () => {
  items = items.filter(i => !i.done)
  saveItems()
  render()
})

clearAllBtn.addEventListener('click', () => {
  if(!confirm('¿Borrar todas las tareas?')) return
  items = []
  saveItems()
  render()
})

function render(){
  list.innerHTML = ''
  if(items.length === 0){
    const li = document.createElement('li')
    li.textContent = 'No hay tareas.'
    li.style.opacity = '0.7'
    list.appendChild(li)
    return
  }
  items.forEach(item => {
    const li = document.createElement('li')
    li.dataset.id = item.id

    const meta = document.createElement('div')
    meta.className = 'todo-meta'

    const checkbox = document.createElement('button')
    checkbox.className = 'toggle'
    checkbox.setAttribute('aria-label', item.done ? 'Marcar como no completada' : 'Marcar como completada')
    checkbox.textContent = item.done ? '✓' : '◻'

    const text = document.createElement('div')
    text.className = 'todo-text' + (item.done ? ' completed' : '')
    text.textContent = item.text

    meta.appendChild(checkbox)
    meta.appendChild(text)

    const actions = document.createElement('div')
    actions.className = 'todo-actions'
    const del = document.createElement('button')
    del.className = 'delete'
    del.setAttribute('aria-label', 'Eliminar tarea')
    del.textContent = '🗑'
    actions.appendChild(del)

    li.appendChild(meta)
    li.appendChild(actions)
    list.appendChild(li)
  })
}

function saveItems(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function loadItems(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }catch(e){
    console.error('No se pudo leer storage', e)
    return []
  }
}

function toggleItem(id){
  items = items.map(i => i.id === id ? { ...i, done: !i.done } : i)
  saveItems()
  render()
}

function deleteItem(id){
  items = items.filter(i => i.id !== id)
  saveItems()
  render()
}

function cryptoRandomId(){
  // simple id using crypto API
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
