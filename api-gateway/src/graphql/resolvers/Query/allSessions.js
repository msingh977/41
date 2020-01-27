import UsersService from '#root/adapters/UsersService'

const sessionsResolver = async () => {
  return await UsersService.fetchSessions()
}

export default sessionsResolver
