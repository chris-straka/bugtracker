/**
 * Express 5 types every `req.params` value as `string | string[]`, because a
 * param can repeat (`/a/:id/b/:id`). None of this app's routes repeat a param,
 * so the first value is always the one we want. Typing the handlers with
 * per-route param generics is not an option here: the express-validator chains
 * in each route are `RequestHandler<ParamsDictionary>`, which pins the whole
 * chain's param type.
 */
export function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value
}
