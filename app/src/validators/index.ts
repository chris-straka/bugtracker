import { query } from 'express-validator'

/** Upper bound on `?limit=` so one request can't page the whole table. */
export const MAX_PAGE_SIZE = 100

export const cursorPaginationValidators = [
  query('cursor').optional().isInt({ min: 0 }).withMessage('Cursor must be a integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: MAX_PAGE_SIZE })
    .withMessage(`Limit must be an integer from 1 to ${MAX_PAGE_SIZE}`),
]

export const searchPaginationValidators = [
  query('search')
    .optional()
    .trim()
    .escape()
    .isString()
    .isLength({ min: 0, max: 100 })
    .withMessage('Search term must be a string'),
  query('cursor').optional().isInt({ min: 0 }).withMessage('Cursor must be a integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: MAX_PAGE_SIZE })
    .withMessage(`Limit must be an integer from 1 to ${MAX_PAGE_SIZE}`),
]
