const BASE_URL =
	'https://labaratory-js-7-default-rtdb.europe-west1.firebasedatabase.app/todos'

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = []

async function fetchTodos() {
	try {
		const response = await fetch(`${BASE_URL}.json`)
		const data = await response.json()

		if (data) {
			todos = Object.keys(data).map(key => ({
				id: key,
				...data[key]
			}))
		} else {
			todos = []
		}
		render()
	} catch (error) {
		console.error('Помилка при читанні:', error)
	}
}

async function addTodo(text) {
	const newTodoItem = {
		text: text,
		completed: false
	}

	try {
		const response = await fetch(`${BASE_URL}.json`, {
			method: 'POST',
			body: JSON.stringify(newTodoItem),
			headers: { 'Content-Type': 'application/json' }
		})
		const result = await response.json()

		todos.push({ id: result.name, ...newTodoItem })
		render()
	} catch (error) {
		console.error('Помилка при додаванні:', error)
	}
}

async function deleteTodo(id) {
	try {
		await fetch(`${BASE_URL}/${id}.json`, {
			method: 'DELETE'
		})
		todos = todos.filter(todo => todo.id !== id)
		render()
	} catch (error) {
		console.error('Помилка при видаленні:', error)
	}
}

async function checkTodo(id) {
	const todo = todos.find(t => t.id === id)
	const updatedStatus = { completed: !todo.completed }

	try {
		await fetch(`${BASE_URL}/${id}.json`, {
			method: 'PATCH',
			body: JSON.stringify(updatedStatus),
			headers: { 'Content-Type': 'application/json' }
		})
		todo.completed = !todo.completed
		render()
	} catch (error) {
		console.error('Помилка при оновленні:', error)
	}
}

function newTodo() {
	const title = prompt('Введіть назву нової справи:')
	if (title && title.trim()) {
		addTodo(title)
	}
}

function renderTodo(todo) {
	return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" 
        ${todo.completed ? 'checked' : ''} onChange="checkTodo('${todo.id}')" />
      <label><span class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">
        ${todo.text}
      </span></label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo('${todo.id}')">delete</button>
    </li>`
}

function render() {
	list.innerHTML = todos.map(todo => renderTodo(todo)).join('')
	updateCounter()
}

function updateCounter() {
	itemCountSpan.textContent = todos.length
	uncheckedCountSpan.textContent = todos.filter(t => !t.completed).length
}

fetchTodos()
