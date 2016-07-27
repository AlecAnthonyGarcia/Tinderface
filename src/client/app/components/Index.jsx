const styles = {
    container: {
        textAlign: 'center'
    }
};

class Index extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
                <div style={styles.container}>
                    <h1>Hello, world!</h1>
                </div>
        );
    }
}

export default Index;
