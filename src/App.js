import React from 'react';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Table from './Container/Table';

function App() {
  return (
    <div>
      <Switch>
          <Route path='/table' component={Table} />
          <Redirect to='/table' />
        </Switch>
    </div>
  );
}

export default withRouter(App);
