import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import MachineListPage from './containers/MachineListPage'
import MachinePage from './containers/MachinePage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MachineListPage} />
    <Route path="machine/:machineid" component={MachinePage} />
  </Route>
)
