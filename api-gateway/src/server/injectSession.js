import UserSession from '#root/adapters/UsersService'

const injectSession = async (req, res, next) => {
  // console.log('sessionID', req.cookies.userSessionId)
  if (req.cookies.userSessionId) {
    const userSession = await UserSession.fetchUserSession({
      sessionId: req.cookies.userSessionId
    })
    res.locals.userSession = userSession
  }
  return next()
}

export default injectSession
