import type { ReactiveController, ReactiveControllerHost } from 'lit'

export type RouteName = 'login' | 'signup' | 'dashboard' | 'project' | 'ticket'

export interface Route {
  name: RouteName
  projectId?: string
  ticketId?: string
}

/**
 * Hash router as a Lit ReactiveController. Hosts construct it
 * (`new RouterController(this)`) and read `route`; every hash change
 * triggers `host.requestUpdate()`.
 */
export class RouterController implements ReactiveController {
  host: ReactiveControllerHost
  route: Route = { name: 'dashboard' }
  private onHashChange = (): void => {
    this.route = RouterController.parse(location.hash)
    this.host.requestUpdate()
  }

  constructor(host: ReactiveControllerHost) {
    this.host = host
    host.addController(this)
  }

  hostConnected(): void {
    window.addEventListener('hashchange', this.onHashChange)
    this.route = RouterController.parse(location.hash)
  }

  hostDisconnected(): void {
    window.removeEventListener('hashchange', this.onHashChange)
  }

  navigate(route: Route): void {
    location.hash = RouterController.href(route)
  }

  static href(route: Route): string {
    switch (route.name) {
      case 'login':
        return '#/login'
      case 'signup':
        return '#/signup'
      case 'project':
        return `#/projects/${route.projectId}`
      case 'ticket':
        return `#/projects/${route.projectId}/tickets/${route.ticketId}`
      case 'dashboard':
      default:
        return '#/'
    }
  }

  static parse(hash: string): Route {
    const path = hash.replace(/^#/, '') || '/'
    const parts = path.split('/').filter(Boolean)

    if (parts[0] === 'login') return { name: 'login' }
    if (parts[0] === 'signup') return { name: 'signup' }
    if (parts[0] === 'projects' && parts[1] && parts[2] === 'tickets' && parts[3]) {
      return { name: 'ticket', projectId: parts[1], ticketId: parts[3] }
    }
    if (parts[0] === 'projects' && parts[1]) {
      return { name: 'project', projectId: parts[1] }
    }
    return { name: 'dashboard' }
  }
}
