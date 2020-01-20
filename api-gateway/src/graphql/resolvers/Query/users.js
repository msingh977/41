import ListingsService from '#root/adapters/UsersService'

const usersResolver = async () => {
  return await ListingsService.fetchUsers()
}

export default usersResolver
