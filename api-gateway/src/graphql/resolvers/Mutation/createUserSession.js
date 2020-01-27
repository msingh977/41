import UsersService from '#root/adapters/UsersService'

const createUserSessionResolver = async (obj, { email, password }, context) => {
  try {
    const userSession = await UsersService.createUserSession({
      email,
      password
    })
    context.res.cookie('userSessionId', userSession.id, {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true
    })
    return userSession
  } catch (e) {
    console.log(`[createUserSession 5] - ${e}`)
  }
}

export default createUserSessionResolver
