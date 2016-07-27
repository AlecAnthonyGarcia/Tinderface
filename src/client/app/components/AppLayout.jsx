import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  container: {
    fontFamily: 'proxima-nova-soft, proxima-nova, Helvetica Neue, helvetica, sans-serif'
  },
  header: {
    position: 'relative',
    width: '100%',
    minHeight: '50px',
    height: '90px',
    maxHeight: '15%',
    borderBottom: '1px solid #F4F4F4'
  },
  headerLogo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '55%',
    transform: 'translate(-50%, -50%)'
  },
  cardContainer: {
    position: 'relative',
    top: 15,
    width: 325,
    maxWidth: '90%',
    margin: '0 auto'
  },
  card: {
    position: 'relative',
    width: '100%',
    marginTop: '-2px',
    marginLeft: '-1px'
  },
  infoContainer: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    borderBottomRightRadius: '3.8% 25%',
    borderBottomLeftRadius: '3.8% 25%',
    borderTop: '1px solid #F4F4F4',
    borderRight: '1px solid #F4F4F4',
    borderBottom: '2px solid #F4F4F4',
    borderLeft: '1px solid #F4F4F4'
  },
  leftTextContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    width: '100%',
    fontSize: '18.966px',
    fontWeight: 900,
    color: '#4A4A4A',
    display: 'block',
    transform: 'translateY(-50%)'
  },
  leftTextName: {
    display: 'inline-block',
    paddingLeft: '6%',
    bottom: 0
  },
  teaserContainer: {
    position: 'absolute',
    top: '75%',
    left: 0,
    width: '100%',
    fontSize: '13.734px',
    display: 'inline-block',
    transform: 'translateY(-50%)'
  },
  teaserText: {
    display: 'inline-block',
    fontWeight: 100,
    paddingLeft: '6%',
    bottom: 0,
    color: '#b3b3b3',
    width: '88%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  userPhoto: {
    position: 'relative',
    borderRadius: '3.8% 3.8% 0 0',
    borderTop: '2px solid #F4F4F4',
    borderRight: '1px solid #F4F4F4',
    borderLeft: '1px solid #F4F4F4',
    width: '100%',
    overflow: 'hidden'
  }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: '#ff6b6b',
  },
});

class Main extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      tinderAuthDialogOpen: false,
      facebookAccessToken: ''
    };
  }
  
  handleTinderAuthDialogRequestClose() {
    this.setState({
      tinderAuthDialogOpen: false,
    });
  }
  
  openTinderAuthDialog() {
    this.setState({
      tinderAuthDialogOpen: true,
    });
  }
  
  getTinderAuthToken() {
    
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          if(response.error) {
            console.log('Invalid Facebook Access Token.');
          } else {
            localStorage.setItem('tinderAuthToken', response.token);
          }
        } else {
          console.log('Error requesting Tinder Auth Token.');
        }
      }
    }
    
    var formData = new FormData();
    formData.append("facebookAccessToken", this.state.facebookAccessToken);
    
    // make internal server request to get auth token from Tinder's API
    xhr.open("POST", './auth', true);
    xhr.send(formData);
    
  }
  
  render() {
    const tinderAuthDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleTinderAuthDialogRequestClose.bind(this)}
        />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={false}
        onTouchTap={this.getTinderAuthToken.bind(this)}
        />
    ];
    
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Dialog
            open={this.state.tinderAuthDialogOpen}
            title="Login to Tinder with Facebook"
            actions={tinderAuthDialogActions}
            onRequestClose={this.handleTinderAuthDialogRequestClose.bind(this)}
            >
            <TextField 
              ref="fbAccessToken"
              floatingLabelText="Facebook Access Token"
              style={{width: '100%'}}
              onChange={() => this.setState({facebookAccessToken: this.refs.fbAccessToken.getValue()})}
              />
          </Dialog>
          
          <div style={styles.header}>
            <img style={styles.headerLogo} src={'logo.png'}/>
          </div>
          
          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <img style={styles.userPhoto} src={'blurred-face.png'} />
              <div style={styles.infoContainer}>
                <div style={styles.leftTextContainer}>
                  <span style={styles.leftTextName}>Your Facebook friend</span>
                  <span>,&nbsp;18</span>
                </div>
                <div style={styles.teaserContainer}>
                  <span style={styles.teaserText}>See their Tinder profile without them knowing</span>
                </div>
              </div>
            </div>
            
            <RaisedButton
              label="Get Started"
              secondary={true}
              style={{position: 'absolute', top: '125%', width: '100%'}}
              onTouchTap={this.openTinderAuthDialog.bind(this)}
              />
            
          </div>
          
        </div>
        
      </MuiThemeProvider>
    );
  }
}

export default Main;
