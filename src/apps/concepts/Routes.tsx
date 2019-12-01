import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Header from '../../components/Header'
import ViewConceptPage from './ViewConceptPage'
import { CreateConceptPage } from './index'
import ViewConceptsPage from './ViewConceptsPage'
import EditConceptPage from './EditConceptPage'
import { SOURCE_CONTAINER } from './constants'

const Routes: React.FC = () => {
  // @ts-ignore
  let { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <ViewConceptsPage containerType={SOURCE_CONTAINER}/>
      </Route>
      <Route exact path={`${path}/new/`}>
        <Header title="Create concept">
          <CreateConceptPage/>
        </Header>
      </Route>
      <Route exact path={`${path}/:concept/`}>
        <ViewConceptPage/>
      </Route>
      <Route exact path={`${path}/:concept/edit/`}>
        <EditConceptPage/>
      </Route>
    </Switch>
  )
}

export default Routes
