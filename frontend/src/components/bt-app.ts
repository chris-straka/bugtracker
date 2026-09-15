import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ApiClient } from '../api/client'
import { AuthController } from '../state/auth-controller'
import { RouterController } from '../state/router-controller'
import './login-view'
import './signup-view'
import './dashboard-view'
import './project-view'
import './ticket-view'

declare global {
  interface Window {
    BUGTRACKER_API_URL?: string
  }
}

/** App shell: owns the client, auth + router controllers, nav, and outlet. */
@customElement('bt-app')
export class BtApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }
    header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      background: #101828;
      color: #fff;
    }
    header h1 {
      font-size: 1.1rem;
      margin: 0;
      margin-right: auto;
    }
    header h1 a {
      color: #fff;
      text-decoration: none;
    }
    header .who {
      font-size: 0.85rem;
      color: #d0d5dd;
    }
    header button {
      font: inherit;
      font-weight: 600;
      background: transparent;
      border: 1px solid #d0d5dd;
      color: #fff;
      border-radius: 6px;
      padding: 0.3rem 0.8rem;
      cursor: pointer;
    }
    main {
      max-width: 64rem;
      margin: 0 auto;
      padding: 1.5rem;
    }
  `

  private client = new ApiClient({
    baseUrl: window.BUGTRACKER_API_URL ?? '',
    onAuthExpired: () => {
      location.hash = '#/login'
    },
  })
  private auth = new AuthController(this, this.client)
  private router = new RouterController(this)

  render() {
    const { route } = this.router

    if (this.auth.busy && !this.auth.isLoggedIn) {
      return html`<main><p>Restoring session…</p></main>`
    }

    const needsAuth = route.name !== 'login' && route.name !== 'signup'
    if (needsAuth && !this.auth.isLoggedIn) {
      return html`
        <main>
          <login-view .auth=${this.auth}></login-view>
        </main>
      `
    }
    if (!needsAuth && this.auth.isLoggedIn) {
      location.hash = '#/'
      return html`<main><p>Redirecting…</p></main>`
    }

    return html`
      <header>
        <h1><a href="#/">Bugtracker</a></h1>
        ${this.auth.isLoggedIn
          ? html`
              <span class="who">${this.auth.user?.username} (${this.auth.mode})</span>
              <button @click=${this.onLogout}>Log out</button>
            `
          : ''}
      </header>
      <main>${this.outlet()}</main>
    `
  }

  private outlet() {
    const { route } = this.router
    switch (route.name) {
      case 'login':
        return html`<login-view .auth=${this.auth}></login-view>`
      case 'signup':
        return html`<signup-view .auth=${this.auth}></signup-view>`
      case 'project':
        return html`
          <project-view .client=${this.client} projectId=${route.projectId ?? ''}></project-view>
        `
      case 'ticket':
        return html`
          <ticket-view
            .client=${this.client}
            projectId=${route.projectId ?? ''}
            ticketId=${route.ticketId ?? ''}
          ></ticket-view>
        `
      case 'dashboard':
      default:
        return html`<dashboard-view .client=${this.client} .auth=${this.auth}></dashboard-view>`
    }
  }

  private async onLogout(): Promise<void> {
    await this.auth.logout()
    location.hash = '#/login'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bt-app': BtApp
  }
}
