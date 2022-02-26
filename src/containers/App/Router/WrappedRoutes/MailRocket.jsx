import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Mail from '../../../Mail';
export default () => (
  <Switch>
    <Route exact path='/mail/system' component={Mail} />
    <Route exact path='/mail/private' component={Mail} />
  </Switch>
);
