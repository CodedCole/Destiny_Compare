import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import statsScreen from "./statsScreen/statsScreen";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={statsScreen} />
                </Switch>
            </Router>
        )
    }
}