import UsersService from '#root/adapters/UsersService'

const deleteUserSessionResolver = async (obj, { sessionId }, context) => {
  await UsersService.deleteUserSession({ sessionId })
  context.res.clear.cookie('userSessionId')

  return true
}

export default deleteUserSessionResolver
