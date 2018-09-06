import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewGame.css";
import { v4 as uuid } from "uuid";

import { API, Auth } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default class NewGame extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleFileChange = event => {
    this.file = event.target.files[0];
  };

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file ? await s3Upload(this.file) : null;

      const {
        signInUserSession: {
          idToken: {
            payload: { sub }
          }
        }
      } = await Auth.currentAuthenticatedUser();

      await this.createGame({
        id: uuid(),
        attachment,
        content: this.state.content,
        userId: sub
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  createGame = async game => {
    return API.post("gamesapi", "/games", {
      body: game
    });
  };

  render() {
    return (
      <div className="NewGame">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Poster</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
