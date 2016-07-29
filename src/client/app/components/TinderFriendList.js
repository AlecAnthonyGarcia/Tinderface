import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Chip from 'material-ui/Chip';
import TinderFriendCard from './TinderFriendCard';
import Avatar from 'material-ui/Avatar';
import SyncIcon from 'material-ui/svg-icons/notification/sync';
import BadMoodIcon from 'material-ui/svg-icons/social/mood-bad';

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
      isLoading: true,
      loadingText: 'Loading...'
    };
  }
  
  componentDidMount() {
    var tinderAuthToken = localStorage.getItem('tinderAuthToken');
    if(tinderAuthToken != null) {
      this.getTinderFacebookFriends(tinderAuthToken);
    }
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
  
  render() {
    return (
      <List style={styles.tinderFriendList}>
        
        {this.state.tinderFriendArray.map((card) => (
          <TinderFriendCard
            key={card.user_id}
            userId={card.user_id}
            headerTitle={card.name}
            headerSubtitle={(card.in_squad) ? 'In a Group' : ''}
            headerAvatar={card.photo[0]["processedFiles"][0]["url"]}
            image={card.photo[0]["processedFiles"][2]["url"]}
            text={card.text}
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