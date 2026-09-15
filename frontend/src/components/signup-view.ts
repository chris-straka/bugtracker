import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { AuthController } from '../state/auth-controller'
import { sharedStyles } from './shared-styles'

@customElement('signup-view')
export class SignupView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        max-width: 26rem;
        margin: 3rem auto;
      }
    `,
  ]

  @property({ attribute: false }) auth!: AuthController

  @state() private username = ''
  @state() private email = ''
  @state() private password = ''

  render() {
    return html`
      <div class="card">
        <h2>Sign up</h2>
        <form class="stack" @submit=${this.onSubmit}>
          <label
            >Username
            <input
              required
              .value=${this.username}
              @input=${(e: Event) => (this.username = (e.target as HTMLInputElement).value)}
            />
          </label>
          <label
            >Email
            <input
              type="email"
              required
              .value=${this.email}
              @input=${(e: Event) => (this.email = (e.target as HTMLInputElement).value)}
            />
          </label>
          <label
            >Password
            <input
              type="password"
              required
              minlength="5"
              maxlength="90"
              .value=${this.password}
              @input=${(e: Event) => (this.password = (e.target as HTMLInputElement).value)}
            />
          </label>
          ${this.auth.error ? html`<div class="error">${this.auth.error}</div>` : ''}
          <button type="submit" ?disabled=${this.auth.busy}>
            ${this.auth.busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p class="muted">Have an account? <a href="#/login">Log in</a></p>
      </div>
    `
  }

  private async onSubmit(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.auth.signup(this.username, this.email, this.password)
      location.hash = '#/'
    } catch {
      // `auth.error` already carries the message.
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'signup-view': SignupView
  }
}
