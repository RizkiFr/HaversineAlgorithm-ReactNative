import React from 'react';
import {View,  ScrollView, ActivityIndicator } from 'react-native';
import { List, ListItem, Icon, Left, Body, Right, Text, Title } from 'native-base';
import * as firebase from 'firebase';

export default class ListKaryawan extends React.Component{
    static navigationOptions = ({navigation})=>{
        return{
            title: 'Penilaian',
            headerStyle:{
                backgroundColor: '#2196F3'
            },
            headerTintColor: '#fff'
            }
        }
    constructor(props){
        super(props),
        this.state={
            karyawan: [],
            loading: true,
            email: null,
            start: '',
            end: ''
        }
    }
    componentDidMount=async()=>{
        // await this.getEmail()
        // await this.setAuth()
        this.getData()
    }

    getData(){
        this.setState({loading: true})
        firebase.database().ref('/karyawan').on('value', snap=>{

            const karyawan = snap.val()
            this.setState({karyawan, loading: false});
            console.log(snap.val())

        },function(errorObject){
            console.log(errorObject)
            this.setState({loading: false});
        });
        console.disableYellowBox = true;
    }

    getEmail(){
        const that = this
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              that.setState({email: user.email})
              console.log(user.email)
            } else {
              console.log('not')
            }
          });
    }

    setAuth(){
        console.log('email')
        const email = this.state.email
        if(email == 'rizqifauzi12@gmail.com'){
            this.setState({start: '1', end: '2'})
        }else if(email == 'ramdanfaisal17@gmail.com'){
            this.setState({start: '4', end: '5'})
        }else if(email == 'dodydestriady@gmail.com'){
            this.setState({start: '7', end: '9'})
        }else if(email == 'hrd.berkatsoft@gmail.com'){
            this.setState({start: '11', end: '13'})
        }else if(email == 'fdavidjm@gmail.com'){
            this.setState({start: '14', end: '19'})
        }
    }

    render(){
        if(this.state.loading){
            return(
                <ActivityIndicator/>
            )
        }
        return(
            <View>
                <ScrollView>
                    <List>
                        {
                        this.state.karyawan.map((data, id)=>
                        <ListItem key={id} onPress={()=>this.props.navigation.navigate('Penilaian', {nama: data})}>
                            <Body>
                                <Text>{data}</Text>
                            </Body>
                            <Right>
                                <Icon name="arrow-forward"/>
                            </Right>
                        </ListItem>
                        )}
                    </List>
                </ScrollView>
            </View>
        )
    }
}