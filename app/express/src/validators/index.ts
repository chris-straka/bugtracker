import { query } from 'express-validator'

export const cursorPaginationValidators =[
  query('search').optional().trim().escape().isString().isLength({ min: 0, max: 100 }).withMessage('Search term must be a string'),
  query('cursor').optional().isInt({ min: 0 }).withMessage('Cursor must be a integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a natural number')
]

export const searchPaginationValidators = [
  query('search').trim().escape().isString().isLength({ min: 0, max: 100 }).withMessage('Search term must be a string'),
  query('cursor').optional().isInt({ min: 0 }).withMessage('Cursor must be a integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a natural number')
]