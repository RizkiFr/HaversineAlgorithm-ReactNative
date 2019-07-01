import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Card, CardItem, Left, Right } from 'native-base';
import { Button } from 'react-native-elements';
import moment from 'moment'; import 'moment/locale/id';
import * as firebase from "firebase";

export default class ViewLog extends React.Component{
    static navigationOptions = ({navigation})=>{
        return{
            title: "Daily Log",
            headerStyle:{
                backgroundColor: '#2196F3'
            },
            headerTintColor: '#fff',
        }
    }

    constructor(props){
        super(props),
        this.state={
            daylog:[],
            loading: false,
            
        }
    }
    componentWillMount() {
        this.getData()
      }

    getData(){
        this.setState({loading: true})
        const that = this
        firebase.database().ref('/log').on('value', snap=>{
            const daylog = []
            snap.forEach(ss =>{
                daylog.push(ss.key);
            })
            that.setState({daylog})
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
            <ScrollView style={{padding: 10}}>
            {
                this.state.loading? <ActivityIndicator /> : null
            }
                {   
                    this.state.daylog.map((daylog, index)=>
                    <Card key={index}>
                        <CardItem button
                                  onPress={()=>this.props.navigation.navigate('ViewLogDetail', {title: daylog, user: daylog })} >
                                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>{daylog}</Text>
                        </CardItem>
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