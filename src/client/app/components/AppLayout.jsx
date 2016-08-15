import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TinderFriendList from './TinderFriendList';

const FACEBOOK_AUTH_DIALOG_URL = "https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&" +
"scope=user_birthday,user_photos,user_education_history,email,user_relationship_details,user_friends,user_work_history,user_likes&" +
"response_type=token%2Csigned_request&client_id=464891386855067";

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
  },
  listHeader: {
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
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
      aboutDialogOpen: false,
      tinderAuthDialogOpen: false,
      tinderAuthDialogErrorText: '',
      isAuthenticated: false,
      facebookAccessToken: ''
    };
  }
  
  componentDidMount() {
    var tinderAuthToken = localStorage.getItem('tinderAuthToken');
    if(tinderAuthToken != null) {
      this.setState({isAuthenticated: true});
    }
  }
  
  handleAboutDialogRequestClose() {
    this.setState({
      aboutDialogOpen: false,
    });
  }
  
  handleTinderAuthDialogRequestClose() {
    this.setState({
      tinderAuthDialogOpen: false,
    });
  }
  
  openAboutDialog() {
    this.setState({
      aboutDialogOpen: true,
    });
  }
  
  openTinderAuthDialog() {
    this.setState({
      tinderAuthDialogOpen: true,
    });
  }

  getTinderAuthToken(fbAuthToken) {
    var itself = this;
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          if(response.error) {
            itself.setState({tinderAuthDialogErrorText: 'Your Facebook Access Token is invalid.'});
          } else {
            localStorage.setItem('tinderAuthToken', response.token);
            itself.handleTinderAuthDialogRequestClose();
            itself.setState({isAuthenticated: true});
          }
        } else {
          itself.setState({tinderAuthDialogErrorText: 'There was an error requesting your Tinder Auth Token.'});
        }
      }
    }
    
    var formData = new FormData();
    formData.append("facebookAccessToken", fbAuthToken);
    
    // make internal server request to get auth token from Tinder's API
    xhr.open("POST", './auth', true);
    xhr.send(formData);
    
  }
  
  parseFacebookAccessToken() {
    if(this.state.facebookAccessToken.includes("access_token")) {
      var fbAccessToken = this.state.facebookAccessToken.match(/access_token=(.+)&/);
      if(fbAccessToken && fbAccessToken[1]) {
        this.setState({facebookAccessToken: fbAccessToken[1]});
        this.getTinderAuthToken(fbAccessToken[1]);
      } else {
        this.setState({tinderAuthDialogErrorText: 'There was a problem parsing your Facebook Access Token.'});
      }
    } else {
      this.getTinderAuthToken(this.state.facebookAccessToken);
    }
  }
  
  logout() {
    localStorage.removeItem('tinderAuthToken');
    this.setState({isAuthenticated: false});
  }
  
  render() {
    const aboutDialogActions = [
      <FlatButton
        label="Okay"
        primary={true}
        onTouchTap={this.handleAboutDialogRequestClose.bind(this)}
        />
    ];
    
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
        onTouchTap={this.parseFacebookAccessToken.bind(this)}
        />
    ];
    
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Dialog
            open={this.state.tinderAuthDialogOpen}
            title="Login to Tinder with Facebook Access Token"
            actions={tinderAuthDialogActions}
            onRequestClose={this.handleTinderAuthDialogRequestClose.bind(this)}
            autoScrollBodyContent={true}
            >
            
            <br />
            Read the steps below before following them to obtain your Facebook Access Token.
            <br /><br />
            
            <h1>Step 1</h1>
            <h4>Click the button below to open the auth dialog and login to Facebook if you are not already.</h4>

            <RaisedButton
              label="OPEN FB AUTH DIALOG"
              primary={true}
              onTouchTap={() => window.open(FACEBOOK_AUTH_DIALOG_URL, "Facebook", true)}
              />
            
            <h1>Step 2</h1>
            
            <h4>You will see a dialog that says you have already authorized Tinder.</h4>
            <h4>At this point, open your browser’s developer tools. (Cmd + Option + I on Mac) or (F12, Ctrl + Shift + I on Windows) or right click the page anywhere and select 'Inspect'.</h4>
            <h4>Switch to the 'Network' tab in your developer tools window. Your dev tools window should look like the image below.</h4>
            
            <img src={'fb-auth-window.png'} style={{width: '100%'}} />    

            <h1>Step 3</h1>
            
            <h4>Press the 'Okay' button on the Tinder dialog, and you will see some activity in the Network tab.</h4>
            <h4>In the Network tab, locate the new 'confirm?dpr=2' entry, and right click it.</h4>
            <h4>Select the 'Copy Response' option from the context menu like in the image below.</h4>
            
            <img src={'dev-tools-window.png'} style={{width: '500px'}} />
            
            <h1>Step 4</h1>
            <h4>After copying the response, paste it into the text field below, press the 'Submit' button, and your FB access token will be parsed from the response. We will then fetch
              your Tinder auth token and log you in to Tinder.</h4>
            
            <TextField 
              ref="fbAccessToken"
              floatingLabelText="Paste Facebook Auth Response"
              style={{width: '100%'}}
              errorText={this.state.tinderAuthDialogErrorText}
              value={this.state.facebookAccessToken}
              onChange={() => this.setState({facebookAccessToken: this.refs.fbAccessToken.getValue()})}
              />
            
          </Dialog>

          <Dialog
            open={this.state.aboutDialogOpen}
            actions={aboutDialogActions}
            onRequestClose={this.handleAboutDialogRequestClose.bind(this)}
            autoScrollBodyContent={true}
            >
            <h2>What is Tinderface?</h2>
            Tinderface is a web app that lets you see the Tinder profiles of your Facebook friends who are opted-in to Tinder Social.
            <h2>How does Tinderface work?</h2>
            Tinderface utilizes Tinder’s private API to retrieve information that the Tinder client already receives and uses it to present a UI
            for the user to interact with. The Tinder  profile on Tinderface will show the user’s biography, photos, distance away, and best of all:
            when they were last active, which was actually removed from the Tinder app, but their API still sends the timestamp.
            <h2>Can I see all of my Facebook friend’s Tinder profiles?</h2>
            No, you can only see the Tinder profiles of your Facebook friends who have explicitly opted-in to Tinder Social. 
            <h2>Will Tinderface hack me?</h2>
            Tinderface does not save any information about you. We simply use your Facebook Access Token to fetch your Tinder authentication token
            so that we can automate API requests. We do not save your Facebook or Tinder tokens. You can view the source on GitHub and run the app yourself
            if you’re paranoid.
          </Dialog>
          
          <div style={styles.header}>
            <img style={styles.headerLogo} src={'logo.png'}/>
          </div>
          
          {!this.state.isAuthenticated ?
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
              
              <div style={{width: '100%', position: 'absolute', top: '140%'}}>
                <FlatButton
                  label="What is this?"
                  secondary={true}
                  style={{color: '#f16464'}}
                  onTouchTap={this.openAboutDialog.bind(this)}
                  icon={<FontIcon color="#f16464" className="icon icon-info" />}
                  />
                <FlatButton
                  label="View Source"
                  href="https://github.com/CaliAlec/Tinderface"
                  secondary={true}
                  style={{color: '#f16464'}}
                  icon={<FontIcon color="#f16464" className="icon icon-github" />}
                  />
              </div>
              
              
            </div>
            : ''
          }
          
          {this.state.isAuthenticated ?
            <ListItem style={styles.listHeader} primaryText="Tinder Facebook Friends" disabled={true} rightIconButton={<IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                <MenuItem
                  primaryText="About"
                  onTouchTap={this.openAboutDialog.bind(this)}
                  />
                <MenuItem
                  primaryText="View Source"
                  onTouchTap={() => window.open('https://github.com/CaliAlec/Tinderface')}
                  />
                <MenuItem
                  primaryText="Logout"
                  onTouchTap={this.logout.bind(this)}
                  />
              </IconMenu>} />
              : ''
            }
            
            {this.state.isAuthenticated ?
              <TinderFriendList/>
              : ''
            }
            
          </div>
          
        </MuiThemeProvider>
      );
    }
  }
  
  export default Main;
