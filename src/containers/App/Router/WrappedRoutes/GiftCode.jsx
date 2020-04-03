import React from 'react';
import { Route, Switch } from 'react-router-dom';

import GiftCode from '../../../GiftCode/index';


export default () => (
  <Switch>
    <Route path="/giftcode" component={GiftCode} />
  </Switch>
);
