import React from 'react';
import {List, ListItem} from 'material-ui/List';
import TinderFriendCard from './TinderFriendCard';

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
      tinderFriendArray: []
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
          var response = JSON.parse(xhr.responseText);
          if(response.error) {
            console.log('Invalid Facebook Access Token.');
          } else {
            itself.setState({tinderFriendArray: response.results});
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
        
      </List>
    );
  }
}

export default TinderFriendList;