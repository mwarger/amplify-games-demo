import React, { Component } from 'react'
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap'
import './Home.css'

import { API, Auth } from 'aws-amplify'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      games: []
    }
  }

  componentDidMount = async () => {
    if (!this.props.isAuthenticated) {
      return
    }

    try {
      const games = await this.games()
      this.setState({ games })
    } catch (e) {
      alert(e)
    }

    this.setState({ isLoading: false })
  }

  games = async () => {
    const {
      signInUserSession: {
        idToken: { jwtToken }
      }
    } = await Auth.currentAuthenticatedUser()
    // console.log('response', response)
    return API.get('prod-games-app-api', '/games', {
      headers: { Authorization: jwtToken }
    })
  }

  renderGamesList(games) {
    return [{}].concat(games).map(
      (game, i) =>
        i !== 0 ? (
          <ListGroupItem
            key={game.gameId}
            href={`/games/${game.gameId}`}
            onClick={this.handleGameClick}
            header={game.content.trim().split('\n')[0]}
          >
            {'Created: ' + new Date(game.createdAt).toLocaleString()}
          </ListGroupItem>
        ) : (
          <ListGroupItem
            key="new"
            href="/games/new"
            onClick={this.handleGameClick}
          >
            <h4>
              <b>{'\uFF0B'}</b> Create a new game
            </h4>
          </ListGroupItem>
        )
    )
  }

  handleGameClick = event => {
    event.preventDefault()
    this.props.history.push(event.currentTarget.getAttribute('href'))
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Gamer Fi</h1>
        <p>A game catalog.</p>
      </div>
    )
  }

  renderGames() {
    return (
      <div className="games">
        <ListGroup>
          {!this.state.isLoading && this.renderGamesList(this.state.games)}
        </ListGroup>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderGames() : this.renderLander()}
      </div>
    )
  }
}
