import React, { Component, PropTypes } from 'react'
import MachineListItem from './MachineListItem'

export default class MachineList extends Component {
  static propTypes = {
    machineDescriptions: PropTypes.array.isRequired
  }
  render() {
    const { machineDescriptions } = this.props

    return (
      <div className="MachineList">
        {machineDescriptions.map(machineDescription =>
          <MachineListItem machineDescription={machineDescription} />
          )
        }
      </div>
    )
  }
}
