/**
 * Express 5 types each `req.params` value as `string | string[]` because a param
 * can repeat (`/a/:id/b/:id`). No route here repeats a param, so take the first
 * value. Per-route param generics don't help because the express-validator chains
 * are typed `RequestHandler<ParamsDictionary>`.
 */
export function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value
}
