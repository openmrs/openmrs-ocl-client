import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CreateDictionaryPage from "./CreateDictionaryPage";
import Header from "../../components/Header";

const Routes: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/dictionaries/new/">
                    <Header title="Create Dictionary">
                        <CreateDictionaryPage/>
                    </Header>
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
