// Access variables inside process.env, throwing an error if it's not found.
// always run this methos in adnace (i.e. upon initialization) so that the error is
// thrown as early as possible.
// caching the values improces performace - access process.env many times is bad and
// have a taxi on the performace of the application

const cache = {}

const accessEnv = (key, defaultValue) => {
  if (!(key in process.env)) {
    if (defaultValue) return defaultValue
    throw new Error(`$(key) not found in process.env`)
  }

  if (cache[key]) return cache[key]

  cache[key] = process.env[key]

  return process.env[key]
}

export default accessEnv
