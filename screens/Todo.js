import React from 'react';
import { View, ScrollView, Text, AsyncStorage, ActivityIndicator, Alert } from 'react-native';
import { Card, CardItem, Icon, Body, Form, Label, Item, Input } from 'native-base';
import moment from 'moment'; import 'moment/locale/id';
import DatePicker from 'react-native-datepicker';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import * as firebase from 'firebase';

export default class Todo extends React.Component{
    static navigationOptions = {
        title: "Todo List",
        headerStyle:{
            backgroundColor: '#2196F3'
        },
        headerTintColor: '#fff'
    }

    constructor(props){
        super(props),
        this.state={
            modal: false,
            modalEdit: false,
            tanggal: null,
            data: [],
            key: [],
            todo: null,
            loadingBtn: false,
            index: null,
            user: null,
            loading: true,
            log:[
                {
                    log: 'Masuk Kantor',
                    date: '2019-01-01'
                },
                {
                    log: 'Pulang Kantor',
                    date: '2019-01-01'
                }
            ],
        }
    }

    componentDidMount=async()=>{
        await this.setTgl()
        this.getData()
    }
    
    setTgl(){
        let tanggal = new moment().locale('id').add(1, 'day').format('dddd, DD MMMM YYYY')
        this.setState({tanggal})
    }

    setDate= async (date)=>{
        const tanggal = await date;
        await this.setState({tanggal});
        this.getData();
    }

    getData(){
        const user = firebase.auth().currentUser;
        this.setState({loading: true})
        const tanggal = this.state.tanggal
        const time = moment(tanggal, 'dddd, DD MMMM YYYY').locale('id').format('DD MMMM YYYY')
        firebase.database().ref('/todo/'+user.displayName+'/'+time).on('value', snap=>{
            
            const data = []
            snap.forEach(ss =>{
                data.push(ss.val());
            })
            if(snap.val() == null){
                console.log('null')
            }else{
                var key = Object.keys(snap.val())
                console.log(key)
            }
            this.setState({loading: false, data, key});

        },function(errorObject){
            console.log(errorObject)
            this.setState({loading: false});
        });
        console.disableYellowBox = true;
    }

    saveData=()=>{
        this.setState({loadingBtn: true})
        const user = firebase.auth().currentUser;
        const data = this.state.todo
        const tanggal = this.state.tanggal
        const time = moment(tanggal, 'dddd, DD MMMM YYYY').locale('id').format('DD MMMM YYYY')
        firebase.database().ref('/todo/'+user.displayName+'/'+time).push({
                todo: data,
        })
        this.setState({
                        modal: !this.state.modal,
                        loadingBtn: false,
                        todo: ''})
        console.disableYellowBox = true;
    }

    deleteTodo=(index, data)=>{
        this.setState({todo: data})
        Alert.alert(
            'Hapus TodoList?',
            '',
            [
                {
                    text: 'Batal',
                    type: 'cacel'
                },
                {
                    text: 'Edit',
                    onPress: ()=>{this.modalEdit(index)}
                },
                {
                    text: 'Hapus',
                    onPress: ()=>{this.acceptDelete(index)}
                }
            ]
        )
    }

    modalEdit=(index)=>{
        this.setState({modalEdit: true, index})
    }

    editTodo=()=>{
        this.setState({loadingBtn: true})
        const index = this.state.index;
        const user = firebase.auth().currentUser;
        const tanggal = this.state.tanggal;
        const todo = this.state.todo;
        const key = this.state.key;
        const time = moment(tanggal, 'dddd, DD MMMM YYYY').locale('id').format('DD MMMM YYYY')
        firebase.database().ref('/todo/'+user.displayName+'/'+time+'/'+key[index]).set({todo})
            .then(res=>{
                this.setState({loadingBtn: false, todo: '', modalEdit: false, index: null})
            }).catch(err=>{
                console.log(err.response)
            })
    }

    acceptDelete=(index)=>{
        const user = firebase.auth().currentUser;
        const tanggal = this.state.tanggal
        const key = this.state.key
        const time = moment(tanggal, 'dddd, DD MMMM YYYY').locale('id').format('DD MMMM YYYY')
        firebase.database().ref('/todo/'+user.displayName+'/'+time+'/'+key[index]).remove()
            .then(res=>{
                console.log(res.data)
            }).catch(err=>{
                console.log(err.response)
            })
    }

    render(){
        return(
            <>
            <View>
                <CardItem style={{backgroundColor: '#E0E0E0'}} >
                    <DatePicker
                            style={{width: '90%'}}
                            locale='id'
                            date={this.state.tanggal}
                            mode="date"
                            format="dddd, DD MMMM YYYY"
                            minDate={this.state.tanggal}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{
                            dateInput: {
                                borderWidth: 0,
                                alignItems: 'flex-start',
                                paddingLeft: 5,
                                },
                            dateText:{
                                fontSize: 18,
                                fontWeight: 'bold'
                            }
                            }}
                            onDateChange={this.setDate.bind(this)}
                        />
                </CardItem>
            </View>
            <ScrollView style={{padding: 10}}>
            {
                this.state.loading? <ActivityIndicator /> : null
            }
                {
                    this.state.data.map((data, index)=>
                    <Card key={index}>
                        <CardItem button onLongPress={()=>this.deleteTodo(index, data.todo)}>
                            <Text style={{flex: 1, fontSize: 16}}>{data.todo}</Text>
                        </CardItem>
                    </Card>
                    )
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
                            <Form>
                                <CardItem style={{marginTop: 10}}>
                                    <Body>
                                        <Item floatingLabel>
                                            <Label>Tambah Todo</Label>
                                            <Input onChangeText={(data)=>this.setState({todo: data})} value={this.state.todo} />
                                        </Item>
                                    </Body>
                                </CardItem>
                                <CardItem footer style={{flexDirection: 'column', alignItems: "flex-end"}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Button title="Batal" type="clear" onPress={()=>this.setState({modal : !this.state.modal, todo: ''})} />
                                        <Button title="Simpan" type="clear" loading={this.state.loadingBtn} onPress={()=>this.saveData()} />
                                    </View>
                                </CardItem>
                            </Form>
                        </Card>
                    </View>
                </Modal>
                <Modal isVisible={this.state.modalEdit}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Card>
                            <Form>
                                <CardItem style={{marginTop: 10}}>
                                    <Body>
                                        <Item floatingLabel>
                                            <Label>Edit Todo</Label>
                                            <Input onChangeText={(data)=>this.setState({todo: data})} value={this.state.todo} />
                                        </Item>
                                    </Body>
                                </CardItem>
                                <CardItem footer style={{flexDirection: 'column', alignItems: "flex-end"}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Button title="Batal" type="clear" onPress={()=>this.setState({modalEdit : !this.state.modalEdit})} />
                                        <Button title="Simpan" type="clear" loading={this.state.loadingBtn} onPress={()=>this.editTodo()} />
                                    </View>
                                </CardItem>
                            </Form>
                        </Card>
                    </View>
                </Modal>
            </ScrollView>
            {/* <View style={{padding: 10}}>
                <Button title="Finish" onPress={this.getUser} />
            </View> */}
            </>
        )
    }
}

