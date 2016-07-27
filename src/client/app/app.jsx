import injectTapEventPlugin from 'react-tap-event-plugin';
import AppLayout from './components/AppLayout';
import { browserHistory, IndexRoute, Route, Router } from 'react-router';

injectTapEventPlugin();

let routes = (
  <Route path="/" component={AppLayout}>
  </Route>
);

ReactDOM.render(
    <Router history={browserHistory}>
        {routes}
    </Router>,
    document.getElementById('page-target')
);