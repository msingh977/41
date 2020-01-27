import { User } from '#root/db/models'
import hashPassword from '#root/helpers/hashPassword'
import comparePassword from '#root/helpers/comparePassword'
import generateUUID from '#root/helpers/generateUUID'
import { addHours } from 'date-fns'
import { UserSession } from '../db/models'

const USER_SESSION_EXPIRY_HOURS = 1

const setupRoutes = app => {
  app.post('/newuser', async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return next(new Error('Invalid body'))
    }

    try {
      const hashedpassword = hashPassword(req.body.password)
      const newUser = await User.create({
        email: req.body.email,
        id: generateUUID(),
        passwordHash: hashedpassword
      })
      return res.json(newUser)
    } catch (e) {
      return next(e)
    }
  })

  app.get('/users/:id', async (req, res, next) => {
    try {
      const oneUser = await User.findByPk(req.params.id)

      if (!oneUser) return next(new Error('Invalid User ID'))
      return res.json(oneUser)
    } catch (e) {
      return next(e)
    }
  })

  app.get('/userlogin/:id', async (req, res, next) => {
    if (!req.body.password) {
      return next(new Error('Invalid body'))
    }
    try {
      const oneUser = await User.findOne({
        password: req.param.id
      })
      return res.json(comparePassword(req.body.password, oneUser.passwordHash))
    } catch (e) {
      return next(e)
    }
  })

  app.post('/sessions', async (req, res, next) => {
    if ((!req.body.password, !req.body.password)) {
      return next(new Error('Invalid body'))
    }

    console.log(`routes[58]-{${req.body.email}, ${req.body.password}}`)

    try {
      const oneUser = await User.findOne({
        attributes: {},
        where: { email: req.body.email }
      })

      if (!oneUser) {
        return next(new Error('Invalid Credentials'))
      }

      if (!comparePassword(req.body.password, oneUser.passwordHash)) {
        return next(new Error('Invalid Credentials'))
      }

      const expiresAt = addHours(new Date(), USER_SESSION_EXPIRY_HOURS)

      const sessionToken = generateUUID()

      const userSession = await UserSession.create({
        id: sessionToken,
        expiresAt,
        userId: oneUser.id
      })

      return res.json(userSession)
    } catch (e) {
      return next(e)
    }
  })

  app.get('/sessions/:sessionId', async (req, res, next) => {
    try {
      const userSession = await UserSession.findByPk(req.params.sessionId)

      if (!userSession) {
        return next(new Error('Invalid session ID'))
      }
      return res.json(userSession)
    } catch (e) {
      return next(e)
    }
  })

  app.delete('/sessions/:sessionId', async (req, res, next) => {
    try {
      const userSession = await UserSession.findByPk(req.params.sessionId)
      if (!userSession) {
        return next(new Error('Invalid session ID'))
      }
      await userSession.destroy()

      return res.end()
    } catch (e) {
      return next(e)
    }
  })

  app.get('/users', async (req, res, next) => {
    try {
      const allUsers = await User.findAll()
      return res.json(allUsers)
    } catch (e) {
      return next(e)
    }
  })
  app.get('/allsessions', async (req, res, next) => {
    try {
      const allSessions = await UserSession.findAll()
      return res.json(allSessions)
    } catch (e) {
      return next(e)
    }
  })
}

export default setupRoutes
