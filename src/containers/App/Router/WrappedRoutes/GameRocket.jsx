import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Leaderboard from '../../../Dashboards/LeaderBoard';
export default () => (
  <Switch>
    <Route exact path='/leaderboard' component={Leaderboard} />
  </Switch>
);
