import React from 'react';
import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import TinderFriendCard from './TinderFriendCard';
import Avatar from 'material-ui/Avatar';
import SyncIcon from 'material-ui/svg-icons/notification/sync';
import BadMoodIcon from 'material-ui/svg-icons/social/mood-bad';
import CommentIcon from 'material-ui/svg-icons/communication/comment';

const styles = {
  tinderFriendList: {
    maxWidth: '344px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '8px',
    paddingRight: '8px',
    overflowX: 'hidden'
  }
};

class TinderFriendList extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      tinderFriendArray: [],
      tinderUserObject: {},
      tinderUserLikesMap: {},
      tinderGroupObject: {},
      editGroupStatusDialogOpen: false,
      editGroupStatusDialogErrorText: '',
      isLoading: true,
      loadingText: 'Loading...'
    };
  }
  
  componentDidMount() {
    var tinderAuthToken = localStorage.getItem('tinderAuthToken');
    if(tinderAuthToken != null) {
      this.getTinderFacebookFriends(tinderAuthToken);
      this.getMyTinderInfo(tinderAuthToken);
    }
  }
  
  handleEditGroupStatusDialogRequestClose() {
    this.setState({
      editGroupStatusDialogOpen: false,
    });
  }
  
  openEditGroupStatusDialog() {
    this.setState({
      editGroupStatusDialogOpen: true,
    });
  }
  
  // retrieve list of Facebook friends who have opted-in to Tinder Social
  getTinderFacebookFriends(tinderAuthToken) {
    var itself = this;
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
            var responseText = xhr.responseText;
            if(responseText === 'Unauthorized') {
              // Return to login page because Tinder auth token expired
              localStorage.removeItem('tinderAuthToken');
              location.reload();
              return;
            }
          var response = JSON.parse(responseText);
          if(response.error) {
            console.log('Invalid Facebook Access Token.');
          } else {
            if(response.results.length === 0) {
              itself.setState({loadingText: 'You have no FB friends who are on Tinder.'});
            } else {
              itself.setState({
                tinderFriendArray: response.results,
                isLoading: false
              });
            }
          }
        } else {
          console.log('Error requesting Tinder Facebook friends.');
        }
      }
    }
    
    var formData = new FormData();
    formData.append("tinderAuthToken", tinderAuthToken);
    
    // make internal server request to get Facebook friends from Tinder's API
    xhr.open("POST", './friends', true);
    xhr.send(formData);
  }
  
  // retrieve the user's Tinder information
  getMyTinderInfo(tinderAuthToken) {
    var itself = this;
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
          var responseText = xhr.responseText;
          if(responseText === 'Unauthorized') {
            // Return to login page because Tinder auth token expired
            localStorage.removeItem('tinderAuthToken');
            location.reload();
            return;
          }
          var response = JSON.parse(responseText);
          if(response.error) {
            console.log('Invalid Facebook Access Token.');
          } else {
            itself.setState({tinderUserObject: response.user});
            // set Tinder Social group object if the user is in a group
            if(itself.state.tinderUserObject.squads.length > 0) {
              var group = itself.state.tinderUserObject.squads[0];
              var groupMembersArray = [];
              // iterate over every group member and get their names
              for(var i = 0; i < group.members.length; i++) {
                groupMembersArray.push(group.members[i]["name"]);
              }
              group.membersList = groupMembersArray.join(", ");
              itself.setState({
                tinderGroupObject: group,
                tinderGroupStatusText: group.status
              });
            }
            itself.generateUserLikesMap(itself.state.tinderUserObject.interests);
          }
        } else {
          console.log('Error requesting Tinder information for the user.');
        }
      }
    }
    
    var formData = new FormData();
    formData.append("tinderAuthToken", tinderAuthToken);
    
    // make internal server request to the user's information from Tinder's API
    xhr.open("POST", './meta', true);
    xhr.send(formData);
  }
  
  updateGroupStatus() {
    var tinderAuthToken = localStorage.getItem('tinderAuthToken')
    if(tinderAuthToken === null) {
      return;
    }
    
    if(this.state.tinderGroupStatusText.length > 60) {
      this.setState({editGroupStatusDialogErrorText: 'Your status cannot be greater than 60 characters.'});
      return;
    }
    
    var itself = this;
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if(xhr.status == 200) {
          var responseText = xhr.responseText;
          if(responseText === "") {
            // status update was successful
            var group = itself.state.tinderGroupObject;
            group.status = itself.state.tinderGroupStatusText;
            itself.setState({
              tinderGroupObject: group,
              editGroupStatusDialogErrorText: ''
            });  
            itself.handleEditGroupStatusDialogRequestClose();
          } else if (responseText === 'Err in updating group') {
            itself.setState({editGroupStatusDialogErrorText: 'Error updating status. Does your group still exist?'});
          } else if(responseText === 'Unauthorized') {
            // Return to login page because Tinder auth token expired
            localStorage.removeItem('tinderAuthToken');
            location.reload();
          } 
        } else {
          console.log('Error updating Tinder group status.');
        }
      }
    }
    
    var formData = new FormData();
    formData.append("tinderAuthToken", tinderAuthToken);
    formData.append("groupId", this.state.tinderGroupObject.id);
    formData.append("status", this.state.tinderGroupStatusText);
    
    // make internal server request to the user's information from Tinder's API
    xhr.open("POST", './group/status', true);
    xhr.send(formData);
  }
  
  // map the id of each user's interest/like to its name
  generateUserLikesMap(likes) {
    likes.map((like) => {
      this.state.tinderUserLikesMap[like.id] = like.name;
    });
  }
  
  // return the name of the interest/like by its id
  getCommonLikeNameById(likeId) {
    if(likeId in this.state.tinderUserLikesMap) {
      return this.state.tinderUserLikesMap[likeId];
    }
    return null;
  }
  
  render() {
    const editGroupStatusDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleEditGroupStatusDialogRequestClose.bind(this)}
        />,
      <FlatButton
        label="Update Status"
        primary={true}
        onTouchTap={this.updateGroupStatus.bind(this)}
        />
    ];
    
    return (

      <List style={styles.tinderFriendList}>
        
        <Dialog
          open={this.state.editGroupStatusDialogOpen}
          title="Edit Group Status"
          actions={editGroupStatusDialogActions}
          onRequestClose={this.handleEditGroupStatusDialogRequestClose.bind(this)}
          autoScrollBodyContent={true}
          >
          
          <TextField 
            ref="groupStatusText"
            floatingLabelText="Group Status (max 60 characters)"
            style={{width: '100%'}}
            errorText={this.state.editGroupStatusDialogErrorText}
            value={this.state.tinderGroupStatusText}
            onChange={() => this.setState({tinderGroupStatusText: this.refs.groupStatusText.getValue()})}
            />
        </Dialog>
        
        {Object.keys(this.state.tinderGroupObject).length > 0 && !this.state.tinderGroupObject.expired  ?
          <div>
            <Card>
              <CardHeader
                title="Tinder Social group with"
                subtitle={this.state.tinderGroupObject.membersList}
                avatar={this.state.tinderUserObject.photos[0]["url"]}
                />
              <CardText>
                <Chip style={{width: '100%'}} >
                  <Avatar color="#444" icon={<CommentIcon />}/>
                  {this.state.tinderGroupObject.status}
                </Chip>
              </CardText>
              <CardActions>
                <FlatButton label="Edit Status" onTouchTap={this.openEditGroupStatusDialog.bind(this)} />
              </CardActions>
            </Card>
            <br />
          </div>
          : ''
        }
        
        {this.state.tinderFriendArray.map((card) => (
          <TinderFriendCard
            key={card.user_id}
            userId={card.user_id}
            headerTitle={card.name}
            headerSubtitle={(card.in_squad) ? 'In a Group' : ''}
            headerAvatar={card.photo[0]["processedFiles"][0]["url"]}
            image={card.photo[0]["processedFiles"][2]["url"]}
            text={card.text}
            getCommonLikeNameById={(likeId) => this.getCommonLikeNameById(likeId)}
            />
        ))}
        
        {this.state.isLoading ?
          <Chip style={{marginLeft: 'auto', marginRight: 'auto'}} >
            {this.state.loadingText === 'Loading...' ?
              <Avatar color="#444" icon={<SyncIcon />} />
              : <Avatar color="#444" icon={<BadMoodIcon />} />
          }
          {this.state.loadingText}
        </Chip>
        : ''
      }
        
      </List>

    );
  }
}

export default TinderFriendList;