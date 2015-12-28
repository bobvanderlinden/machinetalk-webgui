import * as ActionTypes from '../actions'
import merge from 'lodash/object/merge'
import { routerStateReducer as router } from 'redux-router'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
function status(state = { }, action) {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
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
  status,
  errorMessage,
  router
})

export default rootReducer
