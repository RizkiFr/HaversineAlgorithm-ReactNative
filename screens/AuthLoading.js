import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import * as firebase from 'react-native'

export default class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    const user = await AsyncStorage.getItem('user');
    this.props.navigation.navigate(user === 'true' ? 'TabContainer' : 'AuthStack');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}