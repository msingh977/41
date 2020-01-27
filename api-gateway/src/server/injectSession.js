import UserSession from '#root/adapters/UsersService'

const injectSession = async (req, res, next, context) => {
  if (req.cookies.userSessionId) {
    try {
      const userSession = await UserSession.fetchUserSession({
        sessionId: req.cookies.userSessionId
      })
      res.locals.userSession = userSession
    } catch (e) {
      context.res.clearCookie('userSessionId')
      next()
    }
  }
  return next()
}

export default injectSession
