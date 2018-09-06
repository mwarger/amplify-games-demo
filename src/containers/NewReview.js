import React, { Component } from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'

export default class NewReview extends Component {
  state = {
    reviewText: '',
    showReviewForm: false
  }

  validateForm() {
    return this.state.reviewText.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      await this.props.saveGame({
        reviewText: this.state.reviewText
      })
    } catch (e) {
      alert(e)
      this.setState({ isLoading: false })
    }
  }

  render() {
    return this.state.showReviewForm ? (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="reviewText">
            <ControlLabel>Review</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.reviewText}
              componentClass="input"
            />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Submit"
            loadingText="Submitting..."
          />
        </form>
      </div>
    ) : (
      <button>Create Review</button>
    )
  }
}
