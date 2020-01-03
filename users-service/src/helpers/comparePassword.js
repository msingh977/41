import bcrypt from 'bcryptjs'

const comparePassword = (password, comparedPassword) =>
  bcrypt.compareSync(password, comparedPassword)

export default comparePassword
