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
      facebookAccessTokenDialogOpen: false,
      facebookAccessTokenDialogErrorText: '',
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
  
  handleFacebookAccessTokenRequestClose() {
    this.setState({
      facebookAccessTokenDialogOpen: false,
    });
  }
  
  openFacebookAccessTokenDialog() {
    this.setState({
      facebookAccessTokenDialogOpen: true,
    });
  }
  
  getTinderAuthToken() {
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
    formData.append("facebookAccessToken", this.state.facebookAccessToken);
    
    // make internal server request to get auth token from Tinder's API
    xhr.open("POST", './auth', true);
    xhr.send(formData);
    
  }
  
  parseFacebookAccessToken() {
    var fbAccessToken = this.state.facebookAccessToken.match(/#access_token=(.+)&/);
    if(fbAccessToken && fbAccessToken[1]) {
      this.setState({
        facebookAccessToken: fbAccessToken[1],
        facebookAccessTokenDialogErrorText: ''
      });
      this.handleFacebookAccessTokenRequestClose();
    } else {
      this.setState({facebookAccessTokenDialogErrorText: 'There was a problem parsing your Facebook Access Token.'});
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
        onTouchTap={this.getTinderAuthToken.bind(this)}
        />
    ];
    
    const facebookAccessTokenDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleFacebookAccessTokenRequestClose.bind(this)}
        />,
      <FlatButton
        label="PARSE FB TOKEN"
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
            title="Login to Tinder with Facebook"
            actions={tinderAuthDialogActions}
            onRequestClose={this.handleTinderAuthDialogRequestClose.bind(this)}
            autoScrollBodyContent={true}
            >
            <TextField 
              ref="fbAccessToken"
              floatingLabelText="Facebook Access Token"
              style={{width: '100%'}}
              errorText={this.state.tinderAuthDialogErrorText}
              value={this.state.facebookAccessToken}
              onChange={() => this.setState({facebookAccessToken: this.refs.fbAccessToken.getValue()})}
              />
            <FlatButton
              label="Get FB token"
              onTouchTap={this.openFacebookAccessTokenDialog.bind(this)}
              />
          </Dialog>
          
          <Dialog
            open={this.state.facebookAccessTokenDialogOpen}
            title="How do I get my Facebook Access Token?"
            actions={facebookAccessTokenDialogActions}
            onRequestClose={this.handleFacebookAccessTokenRequestClose.bind(this)}
            autoScrollBodyContent={true}
            >
            The easiest way to get your Facebook Access Token is by copying a URL from a popup window. Click the button below and then
            QUICKLY copy the URL of the new window before the URL changes. Once you see the URL change from a long URL to a short one,
            you are free to close the popup.
            <br /><br />
            
            <FlatButton style={{width: '100%'}}
              label="Open window with FB Token"
              onTouchTap={() =>
                window.open('https://www.facebook.com/dialog/oauth?client_id=464891386855067' + 
                '&redirect_uri=https://www.facebook.com/connect/login_success.html' +
                '&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,' + 
                'user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,' +
                'user_relationship_details&response_type=token', 'Login facebook', false)
              }
              />
            
            <br /><br />
            After copying the URL, you can paste it in the textbox below and we will parse your FB token from it.
            
            <TextField 
              ref="fbAccessToken"
              floatingLabelText="Paste URL here"
              style={{width: '100%'}}
              errorText={this.state.facebookAccessTokenDialogErrorText}
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
            Tinderface utilizes Tinder's private API to retrieve information that the Tinder client already receives and uses it to present a UI
            for the user to interact with.
            <h2>Can I see all of my Facebook friend's Tinder profiles?</h2>
            No, you can only see the Tinder profiles of your Facebook friends who have explicitly opted-in to Tinder Social. 
            <h2>Will Tinderface hack me?</h2>
            Tinderface does not save any information about you. We simply use your Facebook Access Token to fetch your Tinder authentication token
            so that we can automate API requests. We do not save your Facebook or Tinder tokens. You can view the source on GitHub and run the app yourself
            if you're paranoid.
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
