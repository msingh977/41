import _ from 'lodash'

const formatGraphQLError = error => {
  const path = _.get(error, 'originalError.response.path')
  const errorDetails = _.get(error, 'originalError.response.body')
  try {
    if (errorDetails) {
      const parsedError = JSON.parse(errorDetails)

      return parsedError
    }
  } catch (e) {}

  return error
}

export default formatGraphQLError
