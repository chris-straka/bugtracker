import { changeKeysFromSnakeToCamel } from '../../utility/snakeToCamel'

describe('changeKeysFromSnakeToCamel', () => {
  test('converts top-level snake_case keys to camelCase', () => {
    expect(changeKeysFromSnakeToCamel({ first_name: 1, user_id: 2 })).toEqual({
      firstName: 1,
      userId: 2,
    })
  })

  test('leaves already-camel keys untouched', () => {
    expect(changeKeysFromSnakeToCamel({ firstName: 1 })).toEqual({ firstName: 1 })
  })

  test('recurses into nested objects', () => {
    expect(changeKeysFromSnakeToCamel({ user_profile: { created_at: 1 } })).toEqual({
      userProfile: { createdAt: 1 },
    })
  })

  test('passes arrays through without converting objects inside them', () => {
    // Known limitation: objects nested in arrays keep snake_case keys.
    expect(changeKeysFromSnakeToCamel({ ticket_list: [{ ticket_id: 1 }] })).toEqual({
      ticketList: [{ ticket_id: 1 }],
    })
  })

  test('preserves non-string scalar values as-is', () => {
    expect(changeKeysFromSnakeToCamel({ is_active: true, login_count: 0 })).toEqual({
      isActive: true,
      loginCount: 0,
    })
  })

  test('handles an empty object', () => {
    expect(changeKeysFromSnakeToCamel({})).toEqual({})
  })
})
