import React from "react";
import {BrowserRouter as Router, Route, Switch, useRouteMatch} from "react-router-dom";
import Header from "../../components/Header";
import ViewConceptPage from './ViewConceptPage'

const Routes: React.FC = () => {
    // @ts-ignore
    let {path} = useRouteMatch();

    return (
        <Router>
            <Switch>
                <Route exact path={path}>
                    <Header title="View concept">
                        <ViewConceptPage />
                    </Header>
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
