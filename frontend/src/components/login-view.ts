import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { AuthMode } from '../api/types'
import { AuthController } from '../state/auth-controller'
import { sharedStyles } from './shared-styles'

/** Email + password login. Offers both transports: the default cookie
 *  session (web) and the JWT pair (API/mobile-style). */
@customElement('login-view')
export class LoginView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        max-width: 26rem;
        margin: 3rem auto;
      }
      .modes {
        display: flex;
        gap: 0.5rem;
      }
      .modes button {
        flex: 1;
      }
      .modes button[aria-pressed='false'] {
        background: transparent;
        color: #175cd3;
      }
    `,
  ]

  @property({ attribute: false }) auth!: AuthController

  @state() private email = ''
  @state() private password = ''
  @state() private mode: AuthMode = 'session'

  render() {
    return html`
      <div class="card">
        <h2>Log in</h2>
        <form class="stack" @submit=${this.onSubmit}>
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
              .value=${this.password}
              @input=${(e: Event) => (this.password = (e.target as HTMLInputElement).value)}
            />
          </label>
          <div class="modes" role="group" aria-label="Login method">
            <button
              type="button"
              aria-pressed=${this.mode === 'session'}
              @click=${() => (this.mode = 'session')}
            >
              Cookie session
            </button>
            <button type="button" aria-pressed=${this.mode === 'jwt'} @click=${() => (this.mode = 'jwt')}>
              JWT tokens
            </button>
          </div>
          ${this.auth.error ? html`<div class="error">${this.auth.error}</div>` : ''}
          <button type="submit" ?disabled=${this.auth.busy}>
            ${this.auth.busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p class="muted">No account? <a href="#/signup">Sign up</a></p>
      </div>
    `
  }

  private async onSubmit(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.auth.login({ email: this.email, password: this.password }, this.mode)
      location.hash = '#/'
    } catch {
      // `auth.error` already carries the message; the controller re-rendered.
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'login-view': LoginView
  }
}
