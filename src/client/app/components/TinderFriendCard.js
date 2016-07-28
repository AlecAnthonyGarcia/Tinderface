import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardText, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import $ from "jquery";
import Toggle from 'material-ui/Toggle';
import moment from 'moment';

class TinderFriendCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      expanded: false,
      tinderUserObject: {},
      tinderShareUrl: ''
    };
  }
  
  getTinderUserProfile(tinderAuthToken, tinderUserId, shouldShare) {
    var itself = this;
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          if(response.error) {
            console.log('Invalid Facebook Access Token.');
          } else {
            if(response.results) {
              itself.setState({tinderUserObject: response.results});
            } else if(response.link) {
              itself.setState({tinderShareUrl: response.link});
            }
          }
        } else {
          console.log('Error requesting Tinder user profile.');
        }
      }
    }
    
    var formData = new FormData();
    formData.append("tinderAuthToken", tinderAuthToken);
    formData.append("tinderUserId", tinderUserId);
    if(shouldShare) {
      formData.append("share", true);
    }
    
    // make internal server request to get the Tinder user's profile information from Tinder's API
    xhr.open("POST", './user', true);
    xhr.send(formData);
  }
  
  // reuse request for user profile, but get share link
  getTinderShareUrl() {
    var tinderAuthToken = localStorage.getItem('tinderAuthToken');
    if(tinderAuthToken != null) {
      this.getTinderUserProfile(tinderAuthToken, this.props.userId, true);
    }
  }
  
  handleExpandChange (expanded) {
    // retrieve Tinder user profile when card is expanded
    // only retrieve profile if tinderUserObject is empty
    if(expanded && Object.keys(this.state.tinderUserObject).length === 0) {
      var tinderAuthToken = localStorage.getItem('tinderAuthToken');
      if(tinderAuthToken != null) {
        this.getTinderUserProfile(tinderAuthToken, this.props.userId, false);
      }
    }
  }
  
  // used to show the profile image gallery
  getPswpElement(callback) {
    // if photoswipe element exists, return it
    if($('#pswp').length) {
      callback(document.getElementById('pswp'));
    } else {
      // photoswipe element doesn't exist, inject it
      $("#pswpContainer").load("../photoswipe.html", function() {
        callback(document.getElementById('pswp'));
      });
    }
  }
  
  showImageGallery() {
    var itself = this;
    
    this.getPswpElement(function(pswpElement) {
      var slides = [];
      
      // add a new slide to the image gallery for each profile picture
      itself.state.tinderUserObject.photos.map((photo) => {
        var image = photo.processedFiles[0];
        slides.push({
          src: image.url,
          msrc: image.url,
          w: image.width,
          h: image.height
        });
      });
      
      var options = {
        closeOnScroll: false,
        shareEl: false
      };
      
      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, slides, options);
      gallery.init();
    });
    
  }
  
  render() {
    
    const {
      headerTitle,
      headerSubtitle,
      headerAvatar,
      image,
      text,
      infoRoute
    } = this.props;
    
    return (
      <Card onExpandChange={this.handleExpandChange.bind(this)}>
        <CardHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          avatar={headerAvatar}
          actAsExpander={true}
          showExpandableButton={true}
          />
        
        <CardMedia
          expandable={true}
          onClick={this.showImageGallery.bind(this)}
          >
          <img src={image}/>
        </CardMedia>
        <CardTitle 
          title={headerTitle.split(' ')[0] + ", " + moment().diff(this.state.tinderUserObject.birth_date, 'years')}
          subtitle={this.state.tinderUserObject.distance_mi + ((this.state.tinderUserObject.distance_mi === 1) ? ' mile' : ' miles') + ' away'
            + ' Active ' +  moment(this.state.tinderUserObject.ping_time).fromNow()}
            expandable={true} />
          <CardText expandable={true}>
            {this.state.tinderUserObject.bio}
            
            {this.state.tinderShareUrl != '' ?
              <div>
                <TextField
                  disabled={true}
                  value={this.state.tinderShareUrl}
                  floatingLabelText="Tinder Share URL"
                  style={{width: '100%'}}
                  />
              </div>
              : ''
            }
            
          </CardText>
          
          <CardActions expandable={true}>
            <FlatButton label="SHARE" onTouchTap={this.getTinderShareUrl.bind(this)} />
          </CardActions>
        </Card>
      );
    }
  }
  
  export default TinderFriendCard;