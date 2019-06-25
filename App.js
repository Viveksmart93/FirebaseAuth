/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, Button, Text, TextInput, Image} from 'react-native';
import firebase from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// pluck values from your `GoogleService-Info.plist` you created on the firebase console
const iosConfig = {
  clientId: '176016041376-kr78scafihs6uhomgmb6en675vjltdgo.apps.googleusercontent.com',
  appId: '1:176016041376:ios:c80d52ccd82b09a7',
  apiKey: 'AIzaSyANankrHEcl_s1RGAnD33qf7qgjl4yj260',
  databaseURL: 'https://login-1329c.firebaseio.com',
  storageBucket: 'login-1329c.appspot.com',
  messagingSenderId: '176016041376',
  projectId: 'login-1329c',

  // enable persistence by adding the below flag
  persistence: true,
};

// pluck values from your `google-services.json` file you created on the firebase console
const androidConfig = {
  clientId: '176016041376-cubhjf76hiendc8vl7iilcli2944ofhq.apps.googleusercontent.com',
  appId: '1:176016041376:android:c80d52ccd82b09a7',
  apiKey: 'AIzaSyDrckquMuaHgY-77zTJBke5hL6veggGm9s',
  databaseURL: 'https://login-1329c.firebaseio.com',
  storageBucket: 'login-1329c.appspot.com',
  messagingSenderId: '176016041376',
  projectId: 'login-1329c',

  // enable persistence by adding the below flag
  persistence: true,
};

const authApp = firebase.initializeApp(
  // use platform specific firebase config
  Platform.OS === 'ios' ? iosConfig : androidConfig,
  // name of this app
  'authApp',
);

var unsubscribe;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+91',
      confirmResult: null,
    };
  }

  async componentWillMount(){
    await authApp.onReady().then((app)=>{
      console.log('app initialization successfull....');
      unsubscribe = firebase.app('authApp').auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user: user.toJSON() });
        } else {
          // User has been signed out, reset the state
          this.setState({
            user: null,
            message: '',
            codeInput: '',
            phoneNumber: '+91',
            confirmResult: null,
          });
        }
      });
    });
  }

  // componentDidMount() {
  //   this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       this.setState({ user: user.toJSON() });
  //     } else {
  //       // User has been signed out, reset the state
  //       this.setState({
  //         user: null,
  //         message: '',
  //         codeInput: '',
  //         phoneNumber: '+44',
  //         confirmResult: null,
  //       });
  //     }
  //   });
  // }

  componentWillUnmount() {
     if (unsubscribe) unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });

    firebase.app('authApp').auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.app('authApp').auth().signOut();
  }

  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state;
    return (
      <View style={{ flex: 1 }}>

        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#77dd77',
              flex: 1,
            }}
          >
            <Text style={{ fontSize: 25 }}>Signed In!</Text>
            <Text>{JSON.stringify(user)}</Text>
            <Button title="Sign Out" color="red" onPress={this.signOut} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
