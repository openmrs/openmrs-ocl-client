import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Header from '../../components/Header'
import { EditDictionaryPage, ViewDictionaryPage } from './pages'
import { DICTIONARY_VERSION_CONTAINER, ViewConceptsPage } from '../concepts'
import AddBulkConceptsPage from './pages/AddBulkConceptsPage'

const Routes: React.FC = () => {
  // @ts-ignore
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:collection/`}>
        <Header title="Details" justifyChildren="space-around">
          <ViewDictionaryPage />
        </Header>
      </Route>
      <Route exact path={`${path}/:collection/edit/`}>
        <Header title="Edit Dictionary">
          <EditDictionaryPage />
        </Header>
      </Route>
      <Route path={`${path}/:collection/:version/concepts/`}>
        <ViewConceptsPage containerType={DICTIONARY_VERSION_CONTAINER} />
      </Route>
      <Route exact path={`${path}/:collection/add/`}>
        <Header title="Add bulk concepts">
          <AddBulkConceptsPage />
        </Header>
      </Route>
    </Switch>
  );
};

export default Routes;
