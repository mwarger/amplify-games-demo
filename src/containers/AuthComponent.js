import React, { Component, Fragment } from "react";
import { Authenticator } from "aws-amplify-react";
import { Button } from "react-bootstrap";
import aws_exports from "../aws-exports";

const Buttons = ({ facebookSignIn, googleSignIn, prefix }) => {
  return (
    <Fragment>
      <Button
        color="facebook"
        fluid
        onClick={facebookSignIn}
        className="socialButtonMargin"
        style={{ marginBottom: 10 }}
      >
        {prefix} with Facebook
      </Button>
      <Button
        color="google plus"
        fluid
        onClick={googleSignIn}
        className="socialButtonMargin"
      >
        {prefix} with Google
      </Button>
    </Fragment>
  );
};

export default class AuthComponent extends Component {
  handleStateChange = state => {
    console.log(state);
    if (state === "signedIn") {
      this.props.userHasAuthenticated(true);
    }
  };

  render() {
    const federated = {
      google_client_id: aws_exports.aws_google_web_app_id,
      facebook_app_id: "456"
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Authenticator
          onStateChange={this.handleStateChange}
          federated={federated}
        />
      </div>
    );
  }
}
