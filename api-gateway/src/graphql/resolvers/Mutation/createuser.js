import UsersService from '#root/adapters/UsersService'
import _ from 'lodash'

const createUserResolver = async (obj, { email, password }) => {
  try {
    const data = await UsersService.createUser({ email, password })
    return {
      ok: true,
      data
    }
  } catch (e) {
    console.log(`[12]: ${e}`)
    return {
      ok: false
    }
  }
}

export default createUserResolver
