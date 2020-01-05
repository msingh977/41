const userSessionResolver = async (obj, args, context) => {
  if (!args.me) throw new Error('unsupported argument value')
  return context.res.locals.userSession
}

export default userSessionResolver
