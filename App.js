import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Daylog from './screens/Daylog';
import DailylogView from './screens/DailylogView';
import Todo from './screens/Todo';
import Login from './screens/Login';
import AuthLoading from './screens/AuthLoading';
import ListKaryawan from './screens/ListKaryawan';
import Penilaian from './screens/Penilaian';
import FormIzin from './screens/FormIzin';
import ViewLog from './screens/ViewLog'
import ViewLogDetail from './screens/ViewLogDetail'
import ViewLogShow from './screens/ViewLogShow'
import { createStackNavigator, createAppContainer, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

export default class App extends React.Component {


  render() {
    return (
      <AppContainer/>
    );
  }
}

const HomeStack = createStackNavigator({
  Home,
  Todo,
  ListKaryawan,
  Penilaian,
  ViewLog,
  ViewLogDetail,
  ViewLogShow,
  FormIzin,
  Daylog,
  DailylogView,
})

const ProfileStack = createStackNavigator({
  Profile: Profile
})

const AuthStack = createStackNavigator({
  Login: Login
})

const TabContainer = createBottomTabNavigator({
  Home: HomeStack,
  Profile: ProfileStack
},
{
  defaultNavigationOptions: ({navigation})=>({
    tabBarIcon: ({focused, tintColor})=>{
      const { routeName } = navigation.state;
      let iconName;
      if(routeName == 'Home'){
        iconName = `ios-home`;
      }else if(routeName == 'Profile'){
      iconName = `ios-contact`
    }
    return <Ionicons name={iconName} size={25} color={tintColor} />
    },
  }),
  tabBarOptions:{
    activeTintColor: '#2196F3',
    inactiveTintColor: 'grey'
  },
})

const AppContainer = createAppContainer(createSwitchNavigator(
  {
  AuthLoading: AuthLoading,
  TabContainer: TabContainer,
  AuthStack: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
))