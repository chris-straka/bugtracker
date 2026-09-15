import { changeKeysFromSnakeToCamel } from '../../utility/snakeToCamel'

describe('changeKeysFromSnakeToCamel leaves string values untouched', () => {
  test('top-level string values with underscores survive as-is', () => {
    expect(
      changeKeysFromSnakeToCamel({
        first_name: 'mary_jane',
        project_name: 'my_cool_project',
      }),
    ).toEqual({
      firstName: 'mary_jane',
      projectName: 'my_cool_project',
    })
  })

  test('nested string values with underscores survive as-is', () => {
    expect(
      changeKeysFromSnakeToCamel({
        user_profile: { display_name: 'some_nick_name', created_at: 1 },
      }),
    ).toEqual({
      userProfile: { displayName: 'some_nick_name', createdAt: 1 },
    })
  })

  test('values that already look camelCase are not altered', () => {
    expect(changeKeysFromSnakeToCamel({ some_key: 'alreadyCamel' })).toEqual({
      someKey: 'alreadyCamel',
    })
  })
})
