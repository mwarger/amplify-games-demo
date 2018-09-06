import AWSAppSyncClient, {
  createAppSyncLink,
  createLinkWithCache
} from 'aws-appsync'
import apolloLogger from 'apollo-link-logger'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import merge from 'lodash.merge'
import { Auth } from 'aws-amplify'
import aws_exports from './aws-exports'

// basic error logger
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

// this is just basic config for the appsync client
const appSyncLink = createAppSyncLink({
  url: aws_exports.aws_appsync_graphqlEndpoint,
  region: aws_exports.aws_appsync_region,
  auth: {
    type: aws_exports.aws_appsync_authenticationType,
    jwtToken: async () =>
      (await Auth.currentSession()).getAccessToken().getJwtToken()
  },
  complexObjectsCredentials: () => Auth.currentCredentials()
})

const link = ApolloLink.from([apolloLogger, errorLink, appSyncLink])

export const client = new AWSAppSyncClient({}, { link })
