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
      tinderShareUrl: '',
      commonLikesArray: []
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
              itself.generateCommonLikes(itself.state.tinderUserObject.common_likes);
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
  
  swipeOnUser(swipeType) {
    var tinderAuthToken = localStorage.getItem('tinderAuthToken');
    if(tinderAuthToken != null) {
      var itself = this;
      var xhr = new XMLHttpRequest();
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if(xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if(response.error) {
              console.log('Invalid Facebook Access Token.');
            } else {
              if(response.likes_remaining == 0) {
                alert("You're Out of Likes!\nGet more likes " + moment(response.rate_limited_until).from(moment()));
              } else if(response.match) {
                alert("It's a match!");
              } else {
                alert("Swiped " + ((swipeType == "pass") ? "left" : "right") + " on " + itself.props.headerTitle.split(' ')[0] + "!");
              }
            }
          } else {
            console.log('Error swiping on Tinder user.');
          }
        }
      }
      
      var formData = new FormData();
      formData.append("tinderAuthToken", tinderAuthToken);
      formData.append("tinderUserId", this.props.userId);
      formData.append("swipeType", swipeType);
      
      // make internal server request to swipe on the the Tinder user
      xhr.open("POST", './swipe', true);
      xhr.send(formData);
    }
  }
  
  // generate a list of likes that both you and the current user have in common
  generateCommonLikes(commonLikes) {
    var itself = this;
    var commonLikesArray = [];
    commonLikes.map((commonLikeId) => {
      var commonLikeName = itself.props.getCommonLikeNameById(commonLikeId);
      commonLikesArray.push({
        id: commonLikeId,
        name: commonLikeName
      });
    });
    this.setState({commonLikesArray: commonLikesArray});
  }
  
  // reuse request for user profile, but get share link
  getTinderShareUrl() {
    var tinderAuthToken = localStorage.getItem('tinderAuthToken');
    if(tinderAuthToken != null) {
      this.getTinderUserProfile(tinderAuthToken, this.props.userId, true);
    }
  }
  
  // open the Facebook page for the corresponding interest/like
  onCommonLikeTap(commonLikeId) {
    window.open("https://www.facebook.com/" + commonLikeId);
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
    
    var profileImage = image;
    var job;
    var school;
    var lastActive = "";
    if(Object.keys(this.state.tinderUserObject).length > 0) {
      profileImage = this.state.tinderUserObject.photos[0]["processedFiles"][0]["url"];
      if(this.state.tinderUserObject.jobs[0]) {
        job = this.state.tinderUserObject.jobs[0]["company"]["name"];
      }
      if(this.state.tinderUserObject.schools[0]) {
        school = this.state.tinderUserObject.schools[0]["name"];
      }
      lastActive = this.state.tinderUserObject.distance_mi + ((this.state.tinderUserObject.distance_mi === 1) ? ' mile' : ' miles') + ' away'
      + ' Active ' + moment(this.state.tinderUserObject.ping_time).fromNow();
    }
    
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
          <img style={{cursor: 'pointer'}} src={profileImage}/>
        </CardMedia>
        <CardTitle 
          title={headerTitle.split(' ')[0] + ", " + moment().diff(this.state.tinderUserObject.birth_date, 'years')}
          subtitle={
            <div>
              <span>{job}</span>
              {(job) ? <br></br> : ''}
              <span>{school}</span>
              {(school) ? <br></br> : ''}
              <span>{lastActive}</span>
            </div>
          }
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
          
          {this.state.commonLikesArray.length > 0 ?
            <div style={{padding: '10px'}} expandable={true}>
              <p>{this.state.commonLikesArray.length} Interest{(this.state.commonLikesArray.length) > 1 ? "s" : ''}</p>
              {this.state.commonLikesArray.map((commonLike) => (
                <FlatButton
                  label={commonLike.name}
                  style={{color: '#fd5068', border: '1px solid', borderRadius: '5px', margin: '3px'}}
                  labelStyle={{textTransform: 'none'}}
                  onTouchTap={() => this.onCommonLikeTap(commonLike.id)} />
              ))}
            </div>
            : ''
          }
          
          <CardActions expandable={true}>
            <FlatButton label={"RECOMMEND " + headerTitle.split(' ')[0]} style={{width: '100%', color: '#fd5068'}} onTouchTap={this.getTinderShareUrl.bind(this)} />
          </CardActions>
          
          <div className="swipeActionContainer" expandable={true}>
            <div className="swipeActionLeft"><img className="swipeActionButton" src={"pass.png"} onClick={() => this.swipeOnUser('pass')}/></div>
            <div className="swipeActionCenter"><img className="swipeActionButton" style={{visibility: 'hidden'}} src={"superlike.png"} /></div>
            <div className="swipeActionRight"><img className="swipeActionButton" src={"like.png"} onClick={() => this.swipeOnUser('like')}/></div>
          </div>
        </Card>
      );
    }
  }
  
  export default TinderFriendCard;