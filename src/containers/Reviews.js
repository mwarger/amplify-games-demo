// @flow
import React from 'react'
import Amplify, { graphqlOperation, Auth } from 'aws-amplify'
import { Connect } from 'aws-amplify-react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import NewReview from './NewReview'

import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import type {
  ListReviewsQuery,
  ListReviewsQueryVariables
} from '../operation-result-types.flow'
import TypedQuery from './TypedQuery'

class ReviewsQuery extends TypedQuery<
  ListReviewsQuery,
  ListReviewsQueryVariables
> {}

const ListReviews = gql`
  query ListReviews($gameId: ID!) {
    reviews: queryReviewsByGameId(gameId: $gameId) {
      items {
        id
        author
        rating
        gameId
      }
    }
  }
`

type ReviewArgs = {
  userId: string,
  gameId: string
}

export default ({ userId, gameId }: ReviewArgs) => {
  if (!userId || !gameId) return null

  return (
    <ReviewsQuery query={ListReviews} variables={{ gameId }}>
      {data => {
        if (!data || !data.reviews) return null
        const { reviews } = data
        return reviews && reviews.items && reviews.items.length ? (
          <ListGroup>
            <h4>Reviews</h4>
            {reviews.items.map(
              item =>
                item && (
                  <ListGroupItem key={item.id}>
                    {item.author || 'Anonymous'} - {item.rating}
                  </ListGroupItem>
                )
            )}
          </ListGroup>
        ) : (
          <p>No reviews to show!</p>
        )
      }}
    </ReviewsQuery>
  )
}
