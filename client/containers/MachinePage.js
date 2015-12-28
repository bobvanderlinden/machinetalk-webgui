import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { } from '../actions'
import { pushState } from 'redux-router'

class MachinePage extends Component {
  static propTypes = {

  }
  render() {
    return (
      <div>Information about machine</div>
    )
  }
}

MachinePage.propTypes = {
  pushState: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {
  pushState
})(MachinePage)
