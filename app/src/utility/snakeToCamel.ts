type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}` 
  ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<U>>}`
  : S

type SnakeToCamelCaseObject<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K]
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function convertSnakeToCamel(str: string) {
  return str.replace(/([_]\w)/g, match => match[1].toUpperCase())
}

function isObjectLiteral(obj: object | string) {
  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) return true
  return false
}

export function changeKeysFromSnakeToCamel<T extends Record<string, any>>(obj: T): SnakeToCamelCaseObject<T> {
  const newObj: {[key: string]: any} = {}

  for (const key of Object.keys(obj)) {
    const newKey = convertSnakeToCamel(key)

    if (isObjectLiteral(obj[key])) {
      newObj[newKey] = changeKeysFromSnakeToCamel(obj[key])
    } else if (typeof obj[key] === 'string') {
      newObj[newKey] = convertSnakeToCamel(obj[key])
    } else {
      newObj[newKey] = obj[key]
    }
  }

  return newObj as SnakeToCamelCaseObject<T>
}
