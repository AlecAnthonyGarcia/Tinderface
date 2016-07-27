import { AppBar } from 'material-ui';
import { Link } from 'react-router';

class PageLayout extends React.Component {
    render() {
        return (
            <div id="app">
                <AppBar title="Simple Website"/>
                <Link to="/">Home</Link>
                <Link to="page2">Page2</Link>
                <div id="page-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default PageLayout;