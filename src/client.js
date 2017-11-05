/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import './client/common/polyfills/common.polyfills';
import React from 'react';
import {Switch, Route} from 'react-router';
import {render} from 'react-dom';
import {Router} from 'react-router';
import {Provider} from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import {syncHistoryWithStore} from 'mobx-react-router';
import TouchEmulator from 'hammer-touchemulator';

import rootRoutes from './routes';
import RootShell from './client/common/shells/RootShell';
import {routerStore, loadingStore} from './client/common/stores';
import {modalStore} from './client/common/features/ModalDialog';

let dest;

const stores = {
  modalStore,
  routerStore,
  loadingStore
};

const Client = ({children}) => (
  <Provider {...stores}>
    <RootShell>
      {children || _renderRoutes(rootRoutes)}
    </RootShell>
  </Provider>
);

if (__CLIENT__) {
  const browserHistory = createBrowserHistory();
  const history = syncHistoryWithStore(browserHistory, routerStore);

  dest = document.getElementById('content');

  render(
    <Router history={history}>
      <Client />
    </Router>,
    dest
  );

  if (__DEVELOPMENT__) {
    TouchEmulator();
  }
}

export default Client;


if (process.env.NODE_ENV !== 'production') {
  global.React = React; // enable debugger

  if (
    !dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']
  ) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

function _renderRoutes(routes) {
  return (
    routes
      ?
      <Switch>
        {routes.map((route, i) => {
          let childComponents = _renderRoutes(route.routes);

          if (childComponents) {
            childComponents = (
              <route.component>
                {childComponents}
              </route.component>
            );
          }
          return (
            <Route
              key={route.key || i}
              path={route.path}
              exact={route.exact}
              strict={route.strict}
              component={childComponents ? null : route.component}>
              {childComponents}
            </Route>
          );
        })}
      </Switch>
      : null
  );
}