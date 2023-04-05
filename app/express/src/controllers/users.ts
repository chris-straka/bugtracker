import type { Request, Response, NextFunction } from 'express'
import UserService from '../services/user'
import { UserIsNotAuthenticatedError } from '../errors'

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.body

  try {
    const user = await UserService.createNewUser(username, email, password, 'contributor')

    req.session.regenerate((err) => {
      if (err != null) next(err)

      req.session.userId = user.id
      req.session.role = user.role

      req.session.save((err) => { 
        if (err != null) next(err) 
        res.status(201).json({ message: 'Successfully signed up' })
      })
    })

  } catch (error) {
    next(error)
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params

  try {
    const user = await UserService.getUserById(userId)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export async function changeUserEmail(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params
  const { email } = req.body

  try {
    await UserService.changeEmail(userId, email)
    res.status(200).json({ message: 'Email updated succesfully' })
  } catch (error) {
    next(error) 
  }
}

export async function changeUsername(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params
  const { username } = req.body

  try {
    await UserService.changeUsername(userId, username)
    res.status(200).json({ message: 'Username updated succesfully' })
  } catch (error) {
    next(error) 
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.session

  try {
    if (!userId) throw new UserIsNotAuthenticatedError()
    await UserService.deleteUserById(userId)
    res.status(204)
  } catch (error) {
    next(error)
  }
}
