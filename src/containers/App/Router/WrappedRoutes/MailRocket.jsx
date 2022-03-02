import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MailSystem from '../../../Mail/MailSystem';
import MailNotifyVersion from '../../../Mail/MailNotifyVersion';

export default () => (
  <Switch>
    <Route exact path='/mail/system' component={MailSystem} />
    <Route exact path='/mail/notifyversion' component={MailNotifyVersion} />
  </Switch>
);
