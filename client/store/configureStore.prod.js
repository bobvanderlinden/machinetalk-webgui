import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory'
import routes from '../routes'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import socketIoMiddleware from '../middleware/socketio'

const finalCreateStore = compose(
  applyMiddleware(thunk, socketIoMiddleware),
  reduxReactRouter({ routes, createHistory })
)(createStore)

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState)
}
