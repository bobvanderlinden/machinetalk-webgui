import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { } from '../actions'
import { pushState } from 'redux-router'
import MachineList from '../components/MachineList'

class MachineListPage extends Component {
  static propTypes = {

  }
  render() {
    return (
      <MachineList machineDescriptions={[]}></MachineList>
    )
  }
}

MachineListPage.propTypes = {
  pushState: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, {
  pushState
})(MachineListPage)
