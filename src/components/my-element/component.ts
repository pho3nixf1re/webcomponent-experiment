import { CSSResultGroup, LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import sheet from './styles.css' assert { type: 'css' }

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static styles: CSSResultGroup = sheet
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Lit logo to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`
      <div>
        <a href="https://lit.dev" target="_blank">
          <img src=${litLogo} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">
          count is ${this.count}
        </button>
      </div>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  private _onClick() {
    this.count++
  }
}
