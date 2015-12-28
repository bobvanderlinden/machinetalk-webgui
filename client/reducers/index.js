import * as ActionTypes from '../actions'
import merge from 'lodash/object/merge'
import { routerStateReducer as router } from 'redux-router'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
function machines(machines = [], action) {
  const { type, uuid, host } = action
  switch(type) {
    case 'machine:online':
      return [
        ... machines,
        {
          uuid: uuid,
          host: host
        }
      ]
    case 'machine:offline':
      return machines.filter(machine => machine.uuid !== uuid)
    case 'machine:status':
      return machines.map(machine => {
        if (machine.uuid === uuid) {
          return {
            ... machine,
            status: action.status
          }
        } else {
          return machine
        }
      })
  }
  return machines
}

function errorMessage(state = null, action) {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

const rootReducer = combineReducers({
  machines,
  errorMessage,
  router
})

export default rootReducer
