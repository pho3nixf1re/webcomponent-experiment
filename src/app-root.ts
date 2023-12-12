import { CSSResultGroup, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import './global.css'
import sheet from './app-root.css' assert { type: 'css' }
import './components/my-element/component'
import './components/todo-list/component'

declare global {
  interface HTMLElementTagNameMap {
    'my-app': AppRoot
  }
}

@customElement('app-root')
class AppRoot extends LitElement {
  static styles: CSSResultGroup = sheet

  render() {
    return html`
      <my-element></my-element>
      <todo-list></todo-list>
    `
  }
}
