import React from 'react';
import './App.css';
import Chatbox from './components/Chatbox';
import { Link } from 'react-router-dom';
import firebase from './firebase';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.message !== '') {
      const chatRef = firebase.database().ref('general');
      const chat = {
        message: this.processEmoticons(this.state.message), // Process the message with emoticons
        user: this.props.user.displayName,
        timestamp: new Date().getTime()
      }
      chatRef.push(chat);
      this.setState({ message: '' });
    }
  }

  processEmoticons = (message) => {
    // Replace emoticon placeholders with actual emoticons
    const emoticonMappings = {
      ':)': '😊',
      ':D': '😃',
      ':(': '😞',
      ';)': '😉',
      ':O': '😮',
      ':P': '😛',
      ':*': '😘',
      ':|': '😐',
      ':/': '😕',
      ':D': '😄',
      ':3': '😺',
      '<3': '❤️',
      ':|': '😐',
      ':$': '🤐',
    };

    let processedMessage = message;
    for (const emoticon in emoticonMappings) {
      const emoticonPlaceholder = emoticon;
      const emoticonValue = emoticonMappings[emoticon];
      processedMessage = processedMessage.replace(emoticonPlaceholder, emoticonValue);
    }

    return processedMessage;
  };

  render() {
    return (
      <div className="App">
        <h1>My Chat App</h1>
        {this.props.user &&
          <div className="allow-chat">
            <Chatbox />
            <form className='message-form' onSubmit={this.onSubmit}>
              <input
                type="text"
                name="message"
                id="message"
                value={this.state.message}
                placeholder="Enter a message..."
                onChange={this.onChange} />
              <button>Send</button>
            </form>
          </div>
        }

        {!this.props.user &&
          <div className="disallow-chat">
            <img src={process.env.PUBLIC_URL + 'cover.jpg'} alt="Cover" />
            <div className="disallow-text">
              <h1>Hi! Here we go!</h1>
              <p><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to begin your chat.
              </p>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;