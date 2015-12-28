import React, { Component, PropTypes } from 'react'
import MachineListItem from './MachineListItem'

export default class MachineList extends Component {
  static propTypes = {
    machines: PropTypes.array.isRequired
  }
  render() {
    const { machines } = this.props
    return (
      <div className="MachineList">
        {machines.map(machine =>
          <MachineListItem machine={machine} />
          )
        }
      </div>
    )
  }
}
