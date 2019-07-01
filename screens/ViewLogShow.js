import React from 'react';
import {  ScrollView, Text, TextInput } from 'react-native';
import { Card, CardItem, Body, Left } from 'native-base';
import * as firebase from "firebase";
import moment from 'moment';

export default class ViewLogShow extends React.Component{
    static navigationOptions = ({navigation}) => {
        return{
            title: navigation.getParam('title'),
            headerStyle:{
                backgroundColor: '#2196F3'
            },
            headerTintColor: '#fff'
            }
    }

    constructor(props){
        super(props),
        this.state={
            modal: false,
            modalDetail: false,
            modalAttachment: false,
            editable: false,
            key: props.navigation.getParam('key'),
            data:{
                detail: "",
                edited: "",
                jam: "",
                loc: "",
                log: "",
            }
            ,
            attc:[
                {
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGEeWX-SdxMsGxjX1SCR-JRQlllc7HA5nyss0O3CPudzG3LZo9cg',
                },
                {
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGEeWX-SdxMsGxjX1SCR-JRQlllc7HA5nyss0O3CPudzG3LZo9cg',
                }
            ]
        }
    }

    componentWillMount() {
        const that = this
        const user = this.props.navigation.getParam('user')
        const time = new moment().locale('id').format('DD MMMM YYYY')
        const key = that.props.navigation.getParam('key');
        firebase.database().ref('/log/'+user+'/'+time+'/'+key).on('value', snap=>{
            const data = snap.val()
            that.setState({data})
        },function(errorObject){
            console.log(errorObject)
        });
        console.ignoredYellowBox = ['Setting a timer'];
      }
    

    render(){
        return(
            <ScrollView style={{padding: 10}}>
                    <Card>
                        <CardItem header>
                            <Left>
                                <Text style={{fontSize: 18}}>Detail</Text>
                            </Left>
                        </CardItem>
                        <CardItem button onLongPress={()=>this.setState({editable: !this.state.editable})} >
                            <Body>
                            {
                                this.state.editable? 
                                <TextInput
                                    autoFocus
                                    value={this.state.data.detail}
                                    multiline={true}
                                    onChangeText={this.update.bind(this)}
                                /> :
                                <Text>{this.state.data.detail}</Text>
                            }
                                
                                
                            </Body>
                        </CardItem>
                    </Card>
                {
                    // this.state.attc.map((attc, index)=>
                    // <Card key={index}>
                    //     <CardItem header>
                    //         <Text style={{fontSize: 18}}>Attachment</Text>
                    //     </CardItem>
                    //     <CardItem>
                    //         <Image
                    //             key={index}
                    //             source={{uri: attc.uri}}
                    //             style={{width: 200, height: 200 }}
                    //         />
                    //     </CardItem>
                    // </Card>
                    // )
                }
                
            </ScrollView>
        )
    }
}

