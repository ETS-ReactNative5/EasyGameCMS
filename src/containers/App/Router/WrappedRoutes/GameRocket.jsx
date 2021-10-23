import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Survival from '../../../Dashboards/LeaderBoard';
import Bossscore from '../../../Dashboards/BossScore';
export default () => (
  <Switch>
    <Route exact path='/leaderboard/survival' component={Survival} />
    <Route exact path='/leaderboard/bossscore' component={Bossscore} />
  </Switch>
);
