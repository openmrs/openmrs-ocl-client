import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {ViewSourcePage} from "./pages";


interface Props {
    viewSource?: boolean;
}

const Routes: React.FC<Props> = ({
     viewSource = true
                                 }) => {
    let { path } = useRouteMatch();
    return (
        <Switch>
            {!viewSource ? null : (
                <Route path={`${path}/:source/`}>
                    <ViewSourcePage />
                </Route>
            )}
        </Switch>
    );
};

export default Routes;
