import type { ReactiveControllerHost } from 'lit'
import { RouterController, type Route } from './router-controller'

function testHost(): ReactiveControllerHost {
  return {
    addController: () => {},
    requestUpdate: jest.fn(),
    updateComplete: Promise.resolve(true),
  } as unknown as ReactiveControllerHost
}

describe('RouterController', () => {
  beforeEach(() => {
    location.hash = '#/'
  })

  it.each([
    ['#/', { name: 'dashboard' }],
    ['#/login', { name: 'login' }],
    ['#/signup', { name: 'signup' }],
    ['#/projects/12', { name: 'project', projectId: '12' }],
    [
      '#/projects/12/tickets/34',
      { name: 'ticket', projectId: '12', ticketId: '34' },
    ],
    ['', { name: 'dashboard' }],
    ['#/nope', { name: 'dashboard' }],
  ])('parses %p', (hash, expected) => {
    expect(RouterController.parse(hash)).toEqual(expected)
  })

  it.each([
    [{ name: 'dashboard' }, '#/'],
    [{ name: 'login' }, '#/login'],
    [{ name: 'signup' }, '#/signup'],
    [{ name: 'project', projectId: '7' }, '#/projects/7'],
    [{ name: 'ticket', projectId: '7', ticketId: '9' }, '#/projects/7/tickets/9'],
  ] as Array<[Route, string]>)('builds %p', (route, expected) => {
    expect(RouterController.href(route)).toBe(expected)
  })

  it('updates the host route on hashchange', () => {
    const host = testHost()
    const router = new RouterController(host)
    router.hostConnected()

    location.hash = '#/projects/3'
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    expect(router.route).toEqual({ name: 'project', projectId: '3' })
    expect(host.requestUpdate).toHaveBeenCalled()
    router.hostDisconnected()
  })

  it('navigates by setting the hash', () => {
    const router = new RouterController(testHost())
    router.navigate({ name: 'ticket', projectId: '1', ticketId: '2' })
    expect(location.hash).toBe('#/projects/1/tickets/2')
  })
})
