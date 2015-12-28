import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
export default class MachineListItem extends Component {
  static propTypes = {
    machine: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired
    }).isRequired
  }
  render() {
    const { uuid, host } = this.props.machine
    return (
      <div className="Machine">
        <Link to={`/machine/${uuid}`}>{host}</Link>
      </div>
    )
  }
}
