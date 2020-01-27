import UsersService from '#root/adapters/UsersService'

const usersResolver = async () => {
  return await UsersService.fetchUsers()
}

export default usersResolver
