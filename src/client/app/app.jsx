import injectTapEventPlugin from 'react-tap-event-plugin';
import AppLayout from './components/AppLayout';
import Page2 from './components/Page2';
import Index from './components/Index';
import { browserHistory, IndexRoute, Route, Router } from 'react-router';

injectTapEventPlugin();

let routes = (
  <Route path="/" component={AppLayout}>
      
      <Route path="page2" component={Page2}/>
  </Route>
);

ReactDOM.render(
    <Router history={browserHistory}>
        {routes}
    </Router>,
    document.getElementById('page-target')
);