import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image, TextInput } from 'react-native';
import { Card, CardItem, Icon, Body, Form, Label, Item, Input, Left, Right, } from 'native-base';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import * as firebase from "firebase";
import moment from 'moment'

export default class DaylogView extends React.Component{
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

    closeDetail=()=>{
        this.setState({modalDetail: false, modal: false})
    }
    closeAttachment=()=>{
        this.setState({modalAttachment: false, modal: false})
    }

    componentWillMount() {
        const that = this
        const user = firebase.auth().currentUser;
        const time = new moment().locale('id').format('DD MMMM YYYY')
        const key = that.props.navigation.getParam('key');
        firebase.database().ref('/log/'+user.displayName+'/'+time+'/'+key).on('value', snap=>{
            const data = snap.val()
            that.setState({data})
            console.log(data)
        },function(errorObject){
            console.log(errorObject)
        });
        console.ignoredYellowBox = ['Setting a timer'];
      }
    
    saveData=()=>{
        const user = firebase.auth().currentUser;
        const key = this.props.navigation.getParam('key');
        const time = new moment().locale('id').format('DD MMMM YYYY')
        const data = Object.assign({}, this.state.data)
        firebase.database().ref('/log/'+user.displayName+'/'+time+'/'+key).update({
                detail: data.detail,
                edited: data.edited,
                jam: data.jam,
                loc: data.loc,
                log: data.log
        })
    this.setState({editable: !this.state.editable})
    }
    trigger=()=>{
        this.state.editable? 
        this.saveData() : this.setState({editable: !this.state.editable});
    }

    update(val){
        const data = Object.assign({}, this.state.data);
        data.detail = val;
        this.setState({data})
    }

    render(){
        return(
            <ScrollView style={{padding: 10}}>
                    <Card>
                        <CardItem header>
                            <Left>
                                <Text style={{fontSize: 18}}>Detail</Text>
                            </Left>
                            <Right>
                                <Button type="clear" title={this.state.editable? 'simpan' : 'edit'} onPress={this.trigger} />
                            </Right>
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
                <Card transparent>
                    <CardItem button onPress={()=>this.setState({modal : !this.state.modal})} style={{paddingLeft: 0, paddingRight: 0, paddingBottom: 0, paddingTop: 0}}>
                        <Body style={{alignItems: 'center'}}>
                            <Icon name="add" style={{fontSize: 40, color: 'grey'}} />
                        </Body>
                    </CardItem>
                </Card>
                <Modal isVisible={this.state.modal}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Card>
                                <CardItem>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Button title="Detail" type="clear" onPress={()=>this.setState({modalDetail: true})} />
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Button title="Attachment" type="clear" onPress={()=>this.setState({modalAttachment: true})} />
                                    </View>
                                </CardItem>
                        </Card>
                    </View>
                    <Modal isVisible={this.state.modalDetail} hasBackdrop={false}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Card>
                                <Form>
                                    <CardItem style={{marginTop: 10}}>
                                        <Body>
                                            <Item floatingLabel>
                                                <Label>Tambah Detail</Label>
                                                <Input />
                                            </Item>
                                        </Body>
                                    </CardItem>
                                    <CardItem footer style={{flexDirection: 'column', alignItems: "flex-end"}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Button title="Batal" type="clear" onPress={this.closeDetail} />
                                            <Button title="Simpan" type="clear" />
                                        </View>
                                    </CardItem>
                                </Form>
                            </Card>
                        </View>
                    </Modal>
                    <Modal isVisible={this.state.modalAttachment} hasBackdrop={false}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Card>
                                <CardItem button style={{marginTop: 10}}>
                                    <Body style={{alignItems: 'center'}}>
                                        <Icon name="camera" style={{color: 'grey', fontSize: 70}} />
                                    </Body>
                                </CardItem>
                                <CardItem footer style={{flexDirection: 'column', alignItems: "flex-end"}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Button title="Batal" type="clear" onPress={this.closeAttachment} />
                                        <Button title="Simpan" type="clear" />
                                    </View>
                                </CardItem>
                            </Card>
                        </View>
                    </Modal>
                </Modal>
                
            </ScrollView>
        )
    }
}

