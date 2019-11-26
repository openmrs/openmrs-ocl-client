import React from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import Header from "../../components/Header";
import ViewConceptPage from './ViewConceptPage'
import { CreateConceptPage } from './index'
import ViewConceptsPage from './ViewConceptsPage'

const Routes: React.FC = () => {
    // @ts-ignore
    let {path} = useRouteMatch();

    return (
      <Switch>
        <Route exact path={`${path}/`}>
          <ViewConceptsPage />
        </Route>
        <Route exact path={`${path}/new/`}>
          <Header title="Create concept">
            <CreateConceptPage/>
          </Header>
        </Route>
        <Route exact path={`${path}/:concept/`}>
          <ViewConceptPage />
        </Route>
      </Switch>
    );
};

export default Routes;
