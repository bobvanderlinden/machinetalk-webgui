import React, { Component, PropTypes } from 'react'

export default class User extends Component {
  static propTypes = {
    machine: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired
    }).isRequired
  }
  render() {
    return (
      <div className="Machine">
      </div>
    )
  }
}
