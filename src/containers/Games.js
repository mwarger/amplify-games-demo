import React, { Component } from "react";
import { API, Storage, Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Games.css";

import { s3Upload } from "../libs/awsLib";

import { Analytics } from "aws-amplify";
import Reviews from "./Reviews";

export default class Games extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      game: null,
      content: "",
      attachmentURL: null
    };
  }

  async componentDidMount() {
    const authStuff = await Auth.currentCredentials();

    console.log("auth stuff", IdentityId);
    const {
      data: { IdentityId }
    } = authStuff;
    try {
      let attachmentURL;
      const game = await this.getGame();
      const { content, attachment } = game;

      // if (attachment) {
      //   attachmentURL = await Storage.vault.get(attachment);
      // }

      this.setState({
        game,
        content,
        attachment,
        userId: IdentityId
      });

      Analytics.record("gameVisit", { content });
    } catch (e) {
      alert(e);
    }
  }

  getGame = async () => {
    const {
      signInUserSession: {
        idToken: { jwtToken }
      }
    } = await Auth.currentAuthenticatedUser();
    return await API.get(
      "gamesapi",
      `/games/object/${this.props.match.params.id}`
    );
  };

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleFileChange = event => {
    this.file = event.target.files[0];
  };

  saveGame(game) {
    return API.put(
      "prod-games-app-api",
      `/games/${this.props.match.params.id}`,
      {
        body: game
      }
    );
  }

  handleSubmit = async event => {
    let attachment;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
      }

      await this.saveGame({
        content: this.state.content,
        attachment: attachment || this.state.game.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  deleteGame() {
    return API.del(
      "prod-games-app-api",
      `/games/${this.props.match.params.id}`
    );
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteGame();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  };

  render() {
    return (
      <div className="Games">
        {this.state.game && (
          <div>
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="content">
                <ControlLabel>Game Title</ControlLabel>
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.content}
                  componentClass="input"
                />
              </FormGroup>
              {this.state.game.attachment && (
                <FormGroup>
                  <ControlLabel>Cover/Poster</ControlLabel>
                  {/* <FormControl.Static>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={this.state.game.attachment}
                    >
                      {this.formatFilename(this.state.game.attachment)}
                    </a>
                  </FormControl.Static> */}
                  <FormControl.Static>
                    <img
                      src={this.state.game.attachment}
                      style={{ maxHeight: 300 }}
                    />
                  </FormControl.Static>
                </FormGroup>
              )}
              <FormGroup controlId="file">
                {!this.state.game.attachment && (
                  <ControlLabel>Attachment</ControlLabel>
                )}
                <FormControl onChange={this.handleFileChange} type="file" />
              </FormGroup>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Save"
                loadingText="Saving…"
              />
              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                text="Delete"
                loadingText="Deleting…"
              />
            </form>
            <Reviews
              gameId={this.props.match.params.id}
              userId={this.state.userId}
            />
          </div>
        )}
      </div>
    );
  }
}
