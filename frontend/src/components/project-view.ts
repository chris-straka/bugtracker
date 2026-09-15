import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ApiClient } from '../api/client'
import type { Comment, Project, ProjectMember, Ticket } from '../api/types'
import { sharedStyles } from './shared-styles'

/** One project: details, tickets, members, and the comment thread. */
@customElement('project-view')
export class ProjectView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .columns {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
      }
      @media (max-width: 50rem) {
        .columns {
          grid-template-columns: 1fr;
        }
      }
      .ticket-link {
        text-decoration: none;
        color: inherit;
      }
      .ticket-link strong {
        color: #175cd3;
      }
      .pill {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 999px;
        padding: 0.1rem 0.6rem;
        background: #eff8ff;
        color: #175cd3;
        margin-left: 0.5rem;
      }
    `,
  ]

  @property({ attribute: false }) client!: ApiClient
  @property() projectId = ''

  @state() private project: Project | null = null
  @state() private tickets: Ticket[] = []
  @state() private members: ProjectMember[] = []
  @state() private comments: Comment[] = []
  @state() private loading = true
  @state() private error: string | null = null
  @state() private ticketName = ''
  @state() private ticketDescription = ''
  @state() private newComment = ''
  @state() private newMemberId = ''
  @state() private editing = false
  @state() private editName = ''
  @state() private editDescription = ''

  connectedCallback(): void {
    super.connectedCallback()
    void this.load()
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading project…</p>`
    if (this.error && !this.project) return html`<div class="error">${this.error}</div>`
    const p = this.project
    if (!p) return html`<div class="error">Project not found.</div>`

    return html`
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      <div class="card">
        <a href="#/">&larr; All projects</a>
        ${this.editing ? this.editForm() : this.detailHead(p)}
      </div>
      <div class="columns">
        <section class="card">
          <h2>Tickets</h2>
          ${this.tickets.length === 0
            ? html`<p class="muted">No tickets yet.</p>`
            : html`
                <ul class="clean">
                  ${this.tickets.map(
                    (t) => html`
                      <li>
                        <a class="ticket-link" href=${`#/projects/${p.id}/tickets/${t.id}`}>
                          <strong>${t.name}</strong>
                          <span class="pill">${t.status ?? 'open'}</span>
                        </a>
                        <div class="muted">${t.description}</div>
                      </li>
                    `,
                  )}
                </ul>
              `}
          <h3>New ticket</h3>
          <form class="stack" @submit=${this.onCreateTicket}>
            <label
              >Name
              <input
                required
                maxlength="100"
                .value=${this.ticketName}
                @input=${(e: Event) => (this.ticketName = (e.target as HTMLInputElement).value)}
              />
            </label>
            <label
              >Description
              <textarea
                required
                maxlength="500"
                .value=${this.ticketDescription}
                @input=${(e: Event) =>
                  (this.ticketDescription = (e.target as HTMLTextAreaElement).value)}
              ></textarea>
            </label>
            <button type="submit">Create ticket</button>
          </form>
        </section>
        <div class="stack">
          <section class="card">
            <h2>Members</h2>
            <ul class="clean">
              ${this.members.map(
                (m) => html`
                  <li class="row">
                    <span>${m.username} <span class="muted">(${m.role})</span></span>
                    <button class="danger ghost" @click=${() => this.onRemoveMember(m.id)}>
                      Remove
                    </button>
                  </li>
                `,
              )}
            </ul>
            <form class="stack" @submit=${this.onAddMember}>
              <label
                >Add user id
                <input
                  required
                  inputmode="numeric"
                  .value=${this.newMemberId}
                  @input=${(e: Event) =>
                    (this.newMemberId = (e.target as HTMLInputElement).value)}
                />
              </label>
              <button type="submit">Add member</button>
            </form>
          </section>
          <section class="card">
            <h2>Comments</h2>
            <ul class="clean">
              ${this.comments.map((c) => html`<li>${c.comment}</li>`)}
            </ul>
            <form class="stack" @submit=${this.onComment}>
              <label
                >New comment
                <textarea
                  required
                  .value=${this.newComment}
                  @input=${(e: Event) =>
                    (this.newComment = (e.target as HTMLTextAreaElement).value)}
                ></textarea>
              </label>
              <button type="submit">Post</button>
            </form>
          </section>
        </div>
      </div>
    `
  }

  private detailHead(p: Project) {
    return html`
      <h2>${p.name}</h2>
      <p>${p.description}</p>
      <div class="row">
        <button class="ghost" @click=${this.startEdit}>Edit</button>
        <button class="danger ghost" @click=${this.onDelete}>Delete project</button>
      </div>
    `
  }

  private editForm() {
    return html`
      <form class="stack" @submit=${this.onEdit}>
        <label
          >Name
          <input
            required
            minlength="5"
            maxlength="100"
            .value=${this.editName}
            @input=${(e: Event) => (this.editName = (e.target as HTMLInputElement).value)}
          />
        </label>
        <label
          >Description
          <textarea
            maxlength="500"
            .value=${this.editDescription}
            @input=${(e: Event) => (this.editDescription = (e.target as HTMLTextAreaElement).value)}
          ></textarea>
        </label>
        <div class="row">
          <button type="submit">Save</button>
          <button type="button" class="ghost" @click=${() => (this.editing = false)}>Cancel</button>
        </div>
      </form>
    `
  }

  private startEdit(): void {
    this.editName = this.project?.name ?? ''
    this.editDescription = this.project?.description ?? ''
    this.editing = true
  }

  private async load(): Promise<void> {
    this.loading = true
    this.error = null
    try {
      const [project, tickets, members, comments] = await Promise.all([
        this.client.get<Project | { project: Project }>(`/projects/${this.projectId}`),
        this.client.get<Ticket[]>(`/projects/${this.projectId}/tickets`),
        this.client.get<ProjectMember[]>(`/projects/${this.projectId}/users`).catch(() => []),
        this.client.get<Comment[]>(`/projects/${this.projectId}/comments`).catch(() => []),
      ])
      this.project = 'project' in project ? project.project : project
      this.tickets = tickets
      this.members = members
      this.comments = comments
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Could not load the project'
    } finally {
      this.loading = false
    }
  }

  private async onCreateTicket(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.client.post(`/projects/${this.projectId}/tickets`, {
        name: this.ticketName,
        description: this.ticketDescription,
      })
      this.ticketName = ''
      this.ticketDescription = ''
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not create the ticket'
    }
  }

  private async onEdit(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.client.put(`/projects/${this.projectId}`, {
        name: this.editName,
        description: this.editDescription,
      })
      this.editing = false
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not update the project'
    }
  }

  private async onDelete(): Promise<void> {
    if (!confirm('Delete this project and all of its tickets?')) return
    try {
      await this.client.delete(`/projects/${this.projectId}`)
      location.hash = '#/'
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not delete the project'
    }
  }

  private async onAddMember(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.client.post(`/projects/${this.projectId}/users`, { userId: this.newMemberId })
      this.newMemberId = ''
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not add the member'
    }
  }

  private async onRemoveMember(userId: number): Promise<void> {
    try {
      await this.client.delete(`/projects/${this.projectId}/users/${userId}`)
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not remove the member'
    }
  }

  private async onComment(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.client.post(`/projects/${this.projectId}/comments`, { comment: this.newComment })
      this.newComment = ''
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not post the comment'
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-view': ProjectView
  }
}
