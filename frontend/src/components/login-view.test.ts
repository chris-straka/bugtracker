import type { ReactiveControllerHost } from 'lit'
import { ApiClient } from '../api/client'
import { AuthController } from '../state/auth-controller'
import './login-view'
import type { LoginView } from './login-view'

function testHost(): ReactiveControllerHost {
  return {
    addController: () => {},
    requestUpdate: () => {},
    updateComplete: Promise.resolve(true),
  } as unknown as ReactiveControllerHost
}

describe('login-view', () => {
  it('renders the form with both login methods', async () => {
    const auth = new AuthController(testHost(), new ApiClient(), {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    })
    const el = document.createElement('login-view') as LoginView
    el.auth = auth
    document.body.appendChild(el)
    await el.updateComplete

    const shadow = el.shadowRoot as ShadowRoot
    expect(shadow.querySelector('input[type="email"]')).not.toBeNull()
    expect(shadow.querySelector('input[type="password"]')).not.toBeNull()
    const modes = [...shadow.querySelectorAll('.modes button')].map((b) => b.textContent?.trim())
    expect(modes).toEqual(['Cookie session', 'JWT tokens'])

    el.remove()
  })

  it('submits through the auth controller and goes home', async () => {
    const auth = new AuthController(testHost(), new ApiClient(), {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    })
    const login = jest.spyOn(auth, 'login').mockResolvedValueOnce(undefined)
    const el = document.createElement('login-view') as LoginView
    el.auth = auth
    document.body.appendChild(el)
    await el.updateComplete

    const shadow = el.shadowRoot as ShadowRoot
    ;(shadow.querySelector('input[type="email"]') as HTMLInputElement).value = 'a@b.c'
    ;(shadow.querySelector('input[type="password"]') as HTMLInputElement).value = 'secret'
    ;(shadow.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    )
    await el.updateComplete

    // Values set directly don't fire the view's @input handlers, so this only
    // checks that submit reaches the controller.
    expect(login).toHaveBeenCalled()
    el.remove()
  })
})
