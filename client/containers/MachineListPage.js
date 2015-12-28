import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { } from '../actions'
import { pushState } from 'redux-router'
import MachineList from '../components/MachineList'

class MachineListPage extends Component {
  static propTypes = {
    machines: PropTypes.array.isRequired
  }
  render() {
    const { machines } = this.props
    return (
      <MachineList machines={machines}></MachineList>
    )
  }
}

MachineListPage.propTypes = {
  machines: PropTypes.array.isRequired,
  pushState: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { machines } = state
  return {
    machines
  }
}

export default connect(mapStateToProps, {
  pushState
})(MachineListPage)
