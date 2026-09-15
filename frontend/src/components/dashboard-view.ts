import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ApiClient } from '../api/client'
import type { Project } from '../api/types'
import { AuthController } from '../state/auth-controller'
import { sharedStyles } from './shared-styles'

/** Landing page: the user's created + assigned projects, plus creation. */
@customElement('dashboard-view')
export class DashboardView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
        gap: 0.75rem;
      }
      .project-link {
        text-decoration: none;
        color: inherit;
        display: block;
      }
      .project-link h3 {
        margin: 0 0 0.25rem;
        color: #175cd3;
      }
      details summary {
        cursor: pointer;
        font-weight: 600;
      }
    `,
  ]

  @property({ attribute: false }) client!: ApiClient
  @property({ attribute: false }) auth!: AuthController

  @state() private mine: Project[] = []
  @state() private assigned: Project[] = []
  @state() private loading = true
  @state() private error: string | null = null
  @state() private name = ''
  @state() private description = ''

  connectedCallback(): void {
    super.connectedCallback()
    void this.load()
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading projects…</p>`
    return html`
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      <section class="card">
        <h2>Welcome, ${this.auth.user?.username}</h2>
        <p class="muted">
          Signed in via ${this.auth.mode === 'jwt' ? 'JWT tokens' : 'cookie session'} as
          ${this.auth.user?.role}.
        </p>
      </section>
      <section>
        <h2>My projects</h2>
        ${this.projectGrid(this.mine, 'You have not created any projects yet.')}
      </section>
      <section>
        <h2>Assigned projects</h2>
        ${this.projectGrid(this.assigned, 'Nobody has added you to a project yet.')}
      </section>
      <details class="card">
        <summary>Create a project</summary>
        <form class="stack" @submit=${this.onCreate}>
          <label
            >Name (4–100 chars)
            <input required minlength="4" maxlength="100" .value=${this.name} @input=${this.bind('name')} />
          </label>
          <label
            >Description (max 500 chars)
            <textarea maxlength="500" .value=${this.description} @input=${this.bind('description')}></textarea>
          </label>
          <button type="submit">Create</button>
        </form>
        <p class="muted">Requires the project_manager, admin, or owner role.</p>
      </details>
    `
  }

  private projectGrid(projects: Project[], empty: string) {
    if (projects.length === 0) return html`<p class="muted">${empty}</p>`
    return html`
      <div class="grid">
        ${projects.map(
          (p) => html`
            <a class="card project-link" href=${`#/projects/${p.id}`}>
              <h3>${p.name}</h3>
              <p class="muted">${p.description}</p>
            </a>
          `,
        )}
      </div>
    `
  }

  private bind(field: 'name' | 'description') {
    return (e: Event) => {
      this[field] = (e.target as HTMLInputElement).value
    }
  }

  private async load(): Promise<void> {
    this.loading = true
    this.error = null
    try {
      const [mine, assigned] = await Promise.all([
        this.client.get<{ projects: Project[] }>('/me/my-projects'),
        this.client.get<{ projects: Project[] }>('/me/assigned-projects'),
      ])
      // GET /me/my-projects unwraps to `{ projects, nextCursor }` for some
      // roles; tolerate either envelope.
      this.mine = unwrapProjects(mine)
      this.assigned = unwrapProjects(assigned)
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Could not load projects'
    } finally {
      this.loading = false
    }
  }

  private async onCreate(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.client.post('/projects', { name: this.name, description: this.description })
      this.name = ''
      this.description = ''
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not create the project'
    }
  }
}

function unwrapProjects(res: { projects: Project[] } | Project[]): Project[] {
  return Array.isArray(res) ? res : (res.projects ?? [])
}

declare global {
  interface HTMLElementTagNameMap {
    'dashboard-view': DashboardView
  }
}
