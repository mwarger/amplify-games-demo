/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ListReviewsQueryVariables = {|
  gameId: string,
|};

export type ListReviewsQuery = {|
  reviews: ? {|
    __typename: "ReviewConnection",
    items: ? Array<? {|
      __typename: string,
      id: string,
      author: ?string,
      rating: number,
      gameId: string,
    |} >,
  |},
|};