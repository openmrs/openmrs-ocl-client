import React from "react";
import {BrowserRouter as Router, Route, Switch, useRouteMatch} from "react-router-dom";
import Header from "../../components/Header";
import ViewDictionaryPage from "./ViewDictionaryPage";

const Routes: React.FC = () => {
    // @ts-ignore
    let { path } = useRouteMatch();

    return (
        <Router>
            <Switch>
                <Route exact path={`${path}/:dictionary/`}>
                    <Header title="Details" justifyChildren='space-around'>
                        <ViewDictionaryPage/>
                    </Header>
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
