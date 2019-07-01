import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Card, CardItem, Body, Left, Right } from 'native-base';
import { Button } from 'react-native-elements';
import moment from 'moment'; import 'moment/locale/id';
import DatePicker from 'react-native-datepicker';
import * as firebase from "firebase";

export default class ViewLogDetail extends React.Component{
    static navigationOptions = ({navigation})=>{
        return{
            title: navigation.getParam('title'),
            headerStyle:{
                backgroundColor: '#2196F3'
            },
            headerTintColor: '#fff',
        }
    }

    constructor(props){
        super(props),
        this.state={
            tanggal: null,
            daylog:[],
            colapse: false,
            loading: false,
            key: [],
            user: props.navigation.getParam('user')
        }
    }
    componentWillMount= async ()=>{
        await this.setTgl();
        this.getData();
        }

    setTgl(){
        const tanggal = new moment().locale('id').format('DD MMMM YYYY');
        this.setState({tanggal});
    }
    setDate= async (date)=>{
        const tanggal = await date;
        await this.setState({tanggal});
        this.getData();
    }  

    getData(){
        this.setState({loading: true})
        const that = this ;
        const user = this.state.user;
        const time = this.state.tanggal;
        firebase.database().ref('/log/'+user+'/'+time).on('value', snap=>{
            const daylog = []
            snap.forEach(ss =>{
                daylog.push(ss.val());
            })
            const data = Object.keys(snap.val())
            that.setState({daylog, key: data})
            this.setState({loading: false});
        },function(errorObject){
            console.log(errorObject)
            this.setState({loading: false});
        });
        console.ignoredYellowBox = ['Setting a timer'];
    }

    render(){
        return(
            <>
            <View>
                <CardItem style={{backgroundColor: '#E0E0E0'}} >
                    <Left>
                        <DatePicker
                            style={{width: '90%'}}
                            locale='id'
                            date={this.state.tanggal}
                            mode="date"
                            placeholder="Waktu Selesai"
                            format="DD MMMM YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{
                            dateInput: {
                                borderWidth: 0,
                                alignItems: 'flex-start',
                                paddingLeft: 5
                                },
                            placeholderText:{
                                fontSize: 16,
                                color: 'grey'
                                }
                            }}
                            onDateChange={this.setDate.bind(this)}
                        />
                    </Left>
                    <Right>
                        <Button
                            icon={{name:"expand-more", fontSize: 18}}
                            onPress={()=>this.setState({colapse: !this.state.colapse})}
                            type="clear" />
                    </Right>
                </CardItem>
            </View>
            <ScrollView style={{padding: 10}}>
            {
                this.state.loading? <ActivityIndicator /> : null
            }
                {   
                    this.state.daylog.map((daylog, index)=>
                    <Card key={index}>
                        <CardItem bordered header button
                                  onPress={()=>this.props.navigation.navigate('ViewLogShow', {title: daylog.log, user: this.state.user, key: this.state.key[index]})} >
                            <Body style={{flexDirection: 'row'}}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 18}} >{daylog.log}</Text>
                                    <Text>{daylog.loc}</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'flex-end'}}>
                                    <Text style={{fontSize: 18}} >{daylog.jam}</Text>
                                    <Text>{daylog.edited}</Text>
                                </View>
                            </Body>
                        </CardItem>
                        {
                            this.state.colapse?
                            <CardItem>
                                <Body>
                                    <Text>{daylog.detail}</Text>
                                </Body>
                            </CardItem> : null
                        }
                    </Card>
                    )
                }
            </ScrollView>
            <View style={{padding: 10}}>
                {/* <Button title="Finish" onPress={this._getLocationAsync} /> */}
            </View>
            </>
        )
    }
}