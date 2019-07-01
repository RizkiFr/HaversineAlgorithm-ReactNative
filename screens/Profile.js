import React from 'react'
import { Text, TextInput, View, ScrollView, AsyncStorage, Alert, RefreshControl } from 'react-native'
import { List, ListItem, Left, Body, Right, Thumbnail, Icon, Card, CardItem, Form, Item, Input, Label } from 'native-base';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import Axios from 'axios';
import * as firebase from 'firebase';

export default class Profile extends React.Component{
    static navigationOptions={
        title: 'Profile',
        headerStyle:{
            backgroundColor: '#2196F3'
        },
        headerTintColor: '#fff'
    }

    constructor(props){
        super(props),
        this.state={
            profile: {},
            refreshing: false,
            editable: false,
            modalVisible: false,
            name: '',
            error: ''
        }
    }

    _onRefresh = () => {
        
      }

    logOut = () =>{
        Alert.alert(
            'Yakin ingin keluar?',
            '',[
            {
                text: 'Batal',
                type: 'cancel'
            },
            {
                text: 'Keluar',
                onPress: ()=>{
                    const that = this;
                    firebase.auth().signOut().then(function() {
                        AsyncStorage.clear()
                        that.props.navigation.navigate('AuthStack')
                      }, function(error) {
                        console.log(error)
                      });
                    }
            }]
        )
    }

    componentDidMount(){
        const profile = firebase.auth().currentUser;
        this.setState({
            profile: profile.providerData[0],
            name: profile.providerData[0].displayName
        })
    }

    update=()=>{
        const that = this
        const profile = firebase.auth().currentUser;
        const name = this.state.name
        profile.updateProfile({
            displayName: name,
          }).then(function(res) {
                console.log(res)
                that._onRefresh()
                that.setState({modalVisible : false})
          }).catch(function(error) {
                console.log(error)
                that.setState({modalVisible : false})
          });
    }

    setName(text){
        this.setState({name: text})
    }
    setPhone(text){
        const profile = Object.assign({}, this.state.profile)
        profile.phoneNumber = text;
        this.setState({profile})
    }
    _onRefresh(){
        const profile = firebase.auth().currentUser;
        this.setState({
            profile: profile.providerData[0],
            name: profile.providerData[0].displayName
        })
    }

    render(){
        return(
            <ScrollView
                refreshControl={
                    <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    />
                }>
                <View style={{padding: 5}}>
                    <Card>
                        <CardItem avatar>
                            <Left style={{flex:1}}>
                                <Thumbnail large source={{uri:'https://cdn1.iconfinder.com/data/icons/technology-devices-2/100/Profile-512.png'}} />
                            </Left>
                                <Body style={{flex:2, justifyContent: 'center'}}>
                                    <Text style={{fontSize: 18}}>{this.state.profile.displayName}</Text>
                                    <Text style={{fontSize: 14}}>{this.state.profile.email}</Text>
                                </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <ListItem icon onPress={()=>this.setState({modalVisible: !this.state.modalVisible})}>
                            <Body>
                                <Text style={{fontSize: 18}}>Edit Nama</Text>
                            </Body>
                        </ListItem>
                        <ListItem icon noBorder onPress={this.logOut}>
                            <Body>
                                <Text style={{fontSize: 18}}>Keluar</Text>
                            </Body>
                        </ListItem>
                    </Card>
                </View>
                <Modal isVisible={this.state.modalVisible}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Card>
                            <Form>
                                <CardItem style={{marginTop: 10}}>
                                    <Body>
                                        <Item floatingLabel>
                                            <Label>Edit Nama</Label>
                                            <Input value={this.state.name} onChangeText={this.setName.bind(this)} />
                                        </Item>
                                    </Body>
                                    <Text>{this.state.error}</Text>
                                </CardItem>
                                <CardItem footer style={{flexDirection: 'column', alignItems: "flex-end"}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Button title="Batal" type="clear" onPress={()=>this.setState({modalVisible : !this.state.modalVisible})} />
                                        <Button title="Simpan" type="clear" onPress={()=>this.update()} />
                                    </View>
                                </CardItem>
                            </Form>
                        </Card>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}