export function encodeBase64(value: string) {
  return Buffer.from(value).toString('base64')
}

export function decodeBase64(encodedValue: string) {
  return Buffer.from(encodedValue, 'base64').toString('ascii')
}
