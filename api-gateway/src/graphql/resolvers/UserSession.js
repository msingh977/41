import UsersService from '#root/adapters/usersService'

const UserSession = {
  user: async userSession => {
    return await UsersService.fetchUser({ userId: userSession.userId })
  }
}

export default UserSession
