import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Card, CardItem, Icon, Body, Form, Label, Item, Input, Left, Right } from 'native-base';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { Constants, Location, Permissions } from 'expo';
import Geocoder from 'react-native-geocoding';
import moment from 'moment'; import 'moment/locale/id';
import * as firebase from "firebase";

export default class Daylog extends React.Component{
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
            modal: false,
            modalEdit: false,
            tanggal: new moment().locale('id').format('dddd, DD MMMM YYYY'),
            daylog:[],
            colapse: false,
            location: null,
            loading: false,
            loadingBtn: false,
            line: 1,
            key: [],
            jam: null,
            keyEdit: null,
            logEdit: null,
            data:{
                detail: "",
                edited: "",
                jam: "",
                loc: "",
                log: "",
            }
        }
    }
    componentWillMount() {
        this.getData()
      }

    getData=async()=>{
        this.setState({loading: true})
        const user = await firebase.auth().currentUser;
        const time = new moment().locale('id').format('DD MMMM YYYY')
        firebase.database().ref('/log/'+user.displayName+'/'+time).on('value', snap=>{
            
            const daylog = []
            snap.forEach(ss =>{
                daylog.push(ss.val());
            })
            if(snap.val() == null){
                console.log('null')
            }else{
                var data = Object.keys(snap.val())
            }
            
            this.setState({daylog, key: data, loading: false})

        },function(errorObject){
            console.log(errorObject)
            this.setState({loading: false});
        });
        console.disableYellowBox = true;
    }

    _getLocationAsync = async () => {
        this.setState({loadingBtn: true})
        const data = Object.assign({}, this.state.data)
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
        this.setState({
          errorMessage: 'Perangkat tidak di izinkan untuk mengakses lokasi.',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        await Geocoder.init('YOUR_API_KEY');
        await Geocoder.from(location.coords.latitude, location.coords.longitude)
              .then(res => {
                  const addressComponent = res.results[0].formatted_address;
                  data.loc = addressComponent;
                  this.setState({data});
                  
              })
              .catch(error => console.warn(error));

        this.addTime()
    };

    saveData=async()=>{
        const user = firebase.auth().currentUser;
        const data = Object.assign({}, this.state.data)
        const time = new moment().locale('id').format('DD MMMM YYYY')
        await firebase.database().ref('/log/'+user.displayName+'/'+time).push({
                detail: data.detail,
                edited: data.edited,
                jam: data.jam,
                loc: data.loc,
                log: data.log
        })
        data.log = ""
        this.setState({modal: !this.state.modal, data, loadingBtn: false})
    }

    addDaily(log){
        const data = Object.assign({}, this.state.data)
        data.log = log
        this.setState({data})
    }

    addTime(){
        const data = Object.assign({}, this.state.data)
        data.jam = new moment().locale('id').format('HH:mm')
        this.setState({data})

        this.saveData()
    }

    modalEditJam(index, log, jam){
        this.setState({modalEdit: true, keyEdit: this.state.key[index], logEdit: log, jam})
        console.log(this.state.keyEdit)
    }

    editJam=async()=>{
        this.setState({loadingBtn: true})
        const user = firebase.auth().currentUser;
        const keyEdit = this.state.keyEdit
        const time = new moment().locale('id').format('DD MMMM YYYY')
        await firebase.database().ref('/log/'+user.displayName+'/'+time+'/'+keyEdit).update({
            log: this.state.logEdit,
            jam: this.state.jam,
            edited: new moment().locale('id').format('HH:mm')
        })
        this.setState({modalEdit: false, jam: null, loadingBtn: false})
    }

    deleteLog=async()=>{
        this.setState({loadingBtn: true})
        const user = firebase.auth().currentUser;
        const keyEdit = this.state.keyEdit
        const time = new moment().locale('id').format('DD MMMM YYYY')
        await firebase.database().ref('/log/'+user.displayName+'/'+time+'/'+keyEdit).set(null)
        this.setState({modalEdit: false, jam: null, loadingBtn: false})
    }

    render(){
        return(
            <>
            <View>
                <CardItem style={{backgroundColor: '#E0E0E0'}} >
                    <Left>
                        <Text style={{fontSize: 18}}>{this.state.tanggal}</Text>
                    </Left>
                    <Right>
                        <Button
                            icon={{name:"expand-more", fontSize: 18}}
                            onPress={()=>this.state.line  == 1 ? this.setState({colapse: !this.state.colapse, line: 10}) : this.setState({colapse: !this.state.colapse, line: 1})}
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
                                  onPress={()=>this.props.navigation.navigate('DailylogView', {title: daylog.log, key: this.state.key[index]})}
                                  onLongPress={daylog.edited == 'Sistem'? null : ()=>this.modalEditJam(index, daylog.log, daylog.jam)} >
                            <Body style={{flexDirection: 'row'}}>
                                <View style={{flex: 2}}>
                                    <Text style={{fontSize: 18}} >{daylog.log}</Text>
                                    <Text numberOfLines={this.state.line}>{daylog.loc}</Text>
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
                                            <Label>Tambah Daily Log</Label>
                                            <Input value={this.state.data.log} onChangeText={this.addDaily.bind(this)} />
                                        </Item>
                                    </Body>
                                </CardItem>
                                <CardItem footer style={{flexDirection: 'column', alignItems: "flex-end"}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Button title="Batal" type="clear" onPress={()=>this.setState({modal : !this.state.modal})} />
                                        <Button title="Simpan" type="clear" loading={this.state.loadingBtn} onPress={this._getLocationAsync} />
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
                                            <Label>Edit Daily Log</Label>
                                            <Input value={this.state.logEdit} onChangeText={(text)=>this.setState({logEdit: text})} />
                                        </Item>
                                        <Item>
                                            <DatePicker
                                                date={this.state.jam}
                                                mode="time"
                                                placeholder="Ubah jam"
                                                format="HH:mm"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                showIcon={false}
                                                customStyles={{
                                                    dateInput: {
                                                        borderWidth: 0,
                                                        alignItems: 'flex-start',
                                                        paddingLeft: 5,
                                                        },
                                                    placeholderText:{
                                                        fontSize: 16,
                                                        color: 'grey'
                                                        }
                                                }}
                                                onDateChange={(date) => {this.setState({jam: date})}}
                                            />
                                        </Item>
                                    </Body>
                                </CardItem>
                                <CardItem footer style={{flexDirection: 'row'}}>
                                    <Body>
                                        <Button title="Hapus" type="clear" loading={this.state.loadingBtn} titleStyle={{color: 'red'}} onPress={()=>this.deleteLog()} />
                                    </Body>
                                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <Button title="Batal" type="clear" onPress={()=>this.setState({modalEdit : !this.state.modalEdit})} />
                                        <Button title="Simpan" type="clear" onPress={()=>this.editJam()} />
                                    </View>
                                </CardItem>
                            </Form>
                        </Card>
                    </View>
                </Modal>
            </ScrollView>
            <View style={{padding: 10}}>
                {/* <Button title="Finish" onPress={this._getLocationAsync} /> */}
            </View>
            </>
        )
    }
}