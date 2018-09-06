import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { v4 as uuid } from "uuid";

import { API, Auth } from "aws-amplify";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      games: []
    };
  }

  componentDidMount = async () => {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const games = await this.games();
      this.setState({ games });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  };

  games = async () => {
    const {
      signInUserSession: {
        idToken: { jwtToken }
      }
    } = await Auth.currentAuthenticatedUser();
    // console.log('response', response)
    return API.get("gamesapi", "/games/a98d1d07-1b22-4a7d-b680-0ee6114fb02a");
  };

  renderGamesList(games) {
    return [{}].concat(games).map(
      (game, i) =>
        i !== 0 ? (
          <ListGroupItem
            key={game.id}
            href={`/games/${game.id}`}
            onClick={this.handleGameClick}
            header={game.content.trim().split("\n")[0]}
          >
            {game.createdAt &&
              "Created: " + new Date(game.createdAt).toLocaleString()}
          </ListGroupItem>
        ) : (
          <ListGroupItem
            key="new"
            href="/games/new"
            onClick={this.handleGameClick}
          >
            <h4>
              <b>{"\uFF0B"}</b> Create a new game
            </h4>
          </ListGroupItem>
        )
    );
  }

  handleGameClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  };

  renderLander() {
    return (
      <div className="lander">
        <h1>Gamer Fi</h1>
        <p>A game catalog.</p>
      </div>
    );
  }

  renderGames() {
    return (
      <div className="games">
        <ListGroup>
          {!this.state.isLoading && this.renderGamesList(this.state.games)}
        </ListGroup>
      </div>
    );
  }

  post = async () => {
    console.log("calling api");
    const {
      signInUserSession: {
        idToken: {
          payload: { sub }
        }
      }
    } = await Auth.currentAuthenticatedUser();
    console.log(sub);
    const response = await API.post("gamesapi", "/games", {
      body: {
        id: uuid(),
        content: "Tomb Raider",
        attachment:
          "https://images-na.ssl-images-amazon.com/images/I/51K8FfZ39aL._SY445_.jpg",
        userId: sub
      }
    });
    alert(JSON.stringify(response, null, 2));
  };
  get = async () => {
    console.log("calling api");
    const response = await API.get(
      "gamesapi",
      "/games/object/a98d1d07-1b22-4a7d-b680-0ee6114fb02a"
    );
    alert(JSON.stringify(response, null, 2));
  };
  list = async () => {
    console.log("calling api");
    const response = await API.get(
      "gamesapi",
      "/games/a98d1d07-1b22-4a7d-b680-0ee6114fb02a"
    );
    alert(JSON.stringify(response, null, 2));
  };

  render() {
    return (
      <div className="Home">
        {/* <button onClick={this.post}>POST</button>
        <button onClick={this.get}>GET</button>
        <button onClick={this.list}>LIST</button> */}

        {this.props.isAuthenticated ? this.renderGames() : this.renderLander()}
      </div>
    );
  }
}
