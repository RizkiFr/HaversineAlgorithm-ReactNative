import React from 'react';
import { ScrollView, View, Text, Image, AsyncStorage } from 'react-native';
import { Card, CardItem, Body, Form, Item, Label, Input } from 'native-base';
import { Button, CheckBox } from 'react-native-elements';
import axios from 'axios';
import moment from 'moment'; import 'moment/locale/id';

export default class Login extends React.Component{
    static navigationOptions = {
        title: 'Form Izin Karyawan',
        headerStyle:{
            backgroundColor: '#2196F3'
        },
        headerTintColor: '#fff'
        }
    
    constructor(props){
        super(props),
        this.state={
            tanggal: new moment().locale('id').format('dddd, DD MMMM YYYY'),

        }
    }

    render(){
        return(
            <ScrollView style={{padding: 10}}>
            <View>
                <CardItem style={{backgroundColor: '#E0E0E0'}} >
                    <Text style={{fontSize: 18}}>{this.state.tanggal}</Text>
                </CardItem>
            </View>
                <Form>
                    <Card>
                        <CardItem style={{flexDirection: 'column', alignItems: 'stretch'}}>
                            <Body>
                                <Text>Saya bertandatangan di bawah ini, </Text>
                                <Item floatingLabel>
                                    <Label>Nama Lengkap</Label>
                                    <Input />
                                </Item>
                                <Item floatingLabel style={{marginTop: 10}}>
                                    <Label>Posisi / Bagian</Label>
                                    <Input />
                                </Item>
                                <Text>Dengan surat ini mohon izin tidak masuk kerja:  </Text>
                                <Item floatingLabel>
                                    <Label>Hari / Tanggal</Label>
                                    <Input />
                                </Item>
                                <Item floatingLabel style={{marginTop: 10}}>
                                    <Label>Lama Hari</Label>
                                    <Input />
                                </Item>
                                <Item floatingLabel style={{marginTop: 10}}>
                                    <Label>Alasan tidak masuk</Label>
                                    <Input />
                                </Item>
                                <Text>Atas perhatian dan kerjasamanya saya ucapkan terimakasih</Text>
                            </Body>
                                <Button
                                    title="Kirim Permintaan" />
                        </CardItem>
                    </Card>
                </Form>
            </ScrollView>
        )
    }
}