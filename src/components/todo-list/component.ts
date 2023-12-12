import { CSSResultGroup, LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import styles from './styles.css' assert { type: 'css' }
import { move } from 'ramda'

declare global {
  interface HTMLElementTagNameMap {
    'todo-list': TodoList
  }
}

@customElement('todo-list')
export class TodoList extends LitElement {
  static styles: CSSResultGroup = styles

  private dragElement: HTMLElement | null = null

  @state()
  private _todos: string[]

  constructor() {
    super()
    this._todos = this.loadTodos()
  }

  private loadTodos() {
    const storedTodos = localStorage.getItem('todos')
    return storedTodos ? JSON.parse(storedTodos) : []
  }

  private addTodo(todo: string) {
    this._todos = [...this._todos, todo]
    this.saveTodos()
  }

  private saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this._todos))
  }

  private removeTodo(index: number) {
    this._todos = this._todos.filter((_, i) => i !== index)
    this.saveTodos()
  }

  protected render() {
    return html`
      <h1 class="title">Todo List</h1>
      <form @submit="${this.onAddTodo}">
        <input name="new-todo" type="text" placeholder="Add a new task" />
        <button type="submit">Add</button>
      </form>
      <ul>
        ${this._todos.map(
          (todo, index) =>
            html`<li
              draggable="true"
              @dragstart="${this.dragStart}"
              @dragover="${this.dragOver}"
              @drop="${this.drop}"
              data-index="${index}"
            >
              ${todo}
              <button @click="${() => this.removeTodo(index)}">remove</button>
            </li>`
        )}
      </ul>
    `
  }

  dragStart(event: DragEvent) {
    const target = event.target as HTMLElement

    if (event.dataTransfer) {
      event.dataTransfer!.effectAllowed = 'move'
    }

    this.dragElement = target
  }

  dragOver(event: DragEvent) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
    return false
  }

  drop(event: DragEvent) {
    event.stopPropagation() // stops the browser from redirecting.
    const target = event.target as HTMLElement

    // Don't do anything if dropping the same column we're dragging.
    if (this.dragElement && this.dragElement != target) {
      const targetIndex = parseInt(target.dataset.index || '0')
      const dropIndex = parseInt(this.dragElement.dataset.index || '0')
      this._todos = move(dropIndex, targetIndex, this._todos)

      this.saveTodos()
    }

    this.dragElement = null
    return false
  }

  private onAddTodo(event: Event) {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const input = form.elements.namedItem('new-todo') as HTMLInputElement

    if (!input.value) {
      return
    }

    this.addTodo(input.value)
    input.value = ''
  }
}
