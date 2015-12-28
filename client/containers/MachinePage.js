import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { machineSubscribe, machineUnsubscribe } from '../actions'
import { pushState } from 'redux-router'

class MachinePage extends Component {
  static propTypes = {
    machineUuid: PropTypes.string.isRequired,
    machine: PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.dispatch(machineSubscribe(this.props.machineUuid))
  }
  componentWillUnmount() {
    this.props.dispatch(machineUnsubscribe(this.props.machineUuid))
  }
  render() {
    const { uuid, status } = this.props.machine
    return (
      <div>
        <div>Information about machine {uuid}</div>
        <pre>{JSON.stringify(status, null, '  ')}</pre>
      </div>
    )
  }
}

MachinePage.propTypes = {
  pushState: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const machineUuid = state.router.params.machineUuid
  return {
    machineUuid: machineUuid,
    machine: state.machines.filter(machine => machine.uuid === machineUuid)[0] || { uuid: machineUuid }
  }
}

export default connect(mapStateToProps, dispatch => ({
  pushState,
  dispatch
}))(MachinePage)
