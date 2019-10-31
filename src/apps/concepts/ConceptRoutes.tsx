import React from "react";
import {BrowserRouter as Router, Route, Switch, useRouteMatch} from "react-router-dom";
import Header from "../../components/Header";
import CreateConceptPage from "./CreateConceptPage";

const Routes: React.FC = () => {
    // @ts-ignore
    let {path} = useRouteMatch();

    return (
        <Router>
            <Switch>
                {/*<Route exact path={`${path}/new/`}>*/}
                {/*    <Header title="Create concept">*/}
                {/*        <CreateConceptPage />*/}
                {/*    </Header>*/}
                {/*</Route>*/}
            </Switch>
        </Router>
    );
};

export default Routes;
