import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ApiClient } from '../api/client'
import type { Comment, ProjectMember, Ticket } from '../api/types'
import { sharedStyles } from './shared-styles'

const STATUSES = ['open', 'in_progress', 'closed', 'additional_info_required']
const PRIORITIES = ['none', 'low', 'medium', 'high', 'critical']

/** One ticket: details, status editing, assignees, and comments. */
@customElement('ticket-view')
export class TicketView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .meta span {
        background: #f2f4f7;
        border-radius: 6px;
        padding: 0.2rem 0.6rem;
        font-size: 0.85rem;
      }
    `,
  ]

  @property({ attribute: false }) client!: ApiClient
  @property() projectId = ''
  @property() ticketId = ''

  @state() private ticket: Ticket | null = null
  @state() private assignees: ProjectMember[] = []
  @state() private comments: Comment[] = []
  @state() private loading = true
  @state() private error: string | null = null
  @state() private status = 'open'
  @state() private priority = 'none'
  @state() private newComment = ''
  @state() private newAssigneeId = ''

  connectedCallback(): void {
    super.connectedCallback()
    void this.load()
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading ticket…</p>`
    if (!this.ticket) return html`<div class="error">${this.error ?? 'Ticket not found.'}</div>`

    const t = this.ticket
    return html`
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      <div class="card">
        <a href=${`#/projects/${this.projectId}`}>&larr; Back to project</a>
        <h2>${t.name}</h2>
        <p>${t.description}</p>
        <div class="meta">
          <span>Type: ${t.type ?? '—'}</span>
          <span>Priority: ${t.priority ?? '—'}</span>
          <span>Status: ${t.status ?? 'open'}</span>
        </div>
        <h3>Update</h3>
        <form class="stack" @submit=${this.onUpdate}>
          <div class="row">
            <label
              >Status
              <select
                .value=${this.status}
                @change=${(e: Event) => (this.status = (e.target as HTMLSelectElement).value)}
              >
                ${STATUSES.map((s) => html`<option value=${s} ?selected=${s === this.status}>${s}</option>`)}
              </select>
            </label>
            <label
              >Priority
              <select
                .value=${this.priority}
                @change=${(e: Event) => (this.priority = (e.target as HTMLSelectElement).value)}
              >
                ${PRIORITIES.map(
                  (p) => html`<option value=${p} ?selected=${p === this.priority}>${p}</option>`,
                )}
              </select>
            </label>
            <button type="submit">Save</button>
            <button type="button" class="danger ghost" @click=${this.onDelete}>Delete</button>
          </div>
        </form>
      </div>
      <div class="card">
        <h2>Assignees</h2>
        <ul class="clean">
          ${this.assignees.map(
            (a) => html`
              <li class="row">
                <span>${a.username}</span>
                <button class="danger ghost" @click=${() => this.onRemoveAssignee(a.id)}>
                  Unassign
                </button>
              </li>
            `,
          )}
        </ul>
        <form class="stack" @submit=${this.onAddAssignee}>
          <label
            >Assign user id
            <input
              required
              inputmode="numeric"
              .value=${this.newAssigneeId}
              @input=${(e: Event) => (this.newAssigneeId = (e.target as HTMLInputElement).value)}
            />
          </label>
          <button type="submit">Assign</button>
        </form>
      </div>
      <div class="card">
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
              @input=${(e: Event) => (this.newComment = (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </label>
          <button type="submit">Post</button>
        </form>
      </div>
    `
  }

  private async load(): Promise<void> {
    this.loading = true
    this.error = null
    try {
      const base = `/projects/${this.projectId}/tickets/${this.ticketId}`
      const [ticket, assignees, comments] = await Promise.all([
        this.client.get<Ticket | { ticket: Ticket }>(base),
        this.client.get<ProjectMember[]>(`${base}/users`).catch(() => []),
        this.client.get<Comment[]>(`${base}/comments`).catch(() => []),
      ])
      const t = 'ticket' in ticket ? ticket.ticket : ticket
      this.ticket = t
      this.status = t.status ?? 'open'
      this.priority = t.priority ?? 'none'
      this.assignees = assignees
      this.comments = comments
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Could not load the ticket'
    } finally {
      this.loading = false
    }
  }

  private async onUpdate(e: Event): Promise<void> {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const [statusSel, prioritySel] = form.querySelectorAll('select')
    try {
      await this.client.put(`/projects/${this.projectId}/tickets/${this.ticketId}`, {
        status: statusSel.value,
        priority: prioritySel.value,
      })
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not update the ticket'
    }
  }

  private async onDelete(): Promise<void> {
    if (!confirm('Delete this ticket?')) return
    try {
      await this.client.delete(`/projects/${this.projectId}/tickets/${this.ticketId}`)
      location.hash = `#/projects/${this.projectId}`
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not delete the ticket'
    }
  }

  private async onAddAssignee(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.client.post(`/projects/${this.projectId}/tickets/${this.ticketId}/users`, {
        userId: this.newAssigneeId,
      })
      this.newAssigneeId = ''
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not assign the user'
    }
  }

  private async onRemoveAssignee(userId: number): Promise<void> {
    try {
      await this.client.delete(`/projects/${this.projectId}/tickets/${this.ticketId}/users/${userId}`)
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not unassign the user'
    }
  }

  private async onComment(e: Event): Promise<void> {
    e.preventDefault()
    try {
      await this.client.post(`/projects/${this.projectId}/tickets/${this.ticketId}/comments`, {
        comment: this.newComment,
      })
      this.newComment = ''
      await this.load()
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Could not post the comment'
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ticket-view': TicketView
  }
}
