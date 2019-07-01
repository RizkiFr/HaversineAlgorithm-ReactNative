import React from 'react';
import { View, ScrollView, Text, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements'
import { Card, CardItem, Icon, Body } from 'native-base';
import Slideshow from 'react-native-image-slider-show';
import { Constants, Location, Permissions } from 'expo';
import axios from 'axios';
import { AdMobBanner, } from 'expo';
import * as firebase from 'firebase';
import moment from 'moment'

export default class Home extends React.Component{
    static navigationOptions = {
        title: "Berkat Internal Sistem (BIS)",
        headerStyle:{
            backgroundColor: '#2196F3'
        },
        headerTintColor: '#fff'
    }

    constructor(props){
        super(props),
        this.state={
            dataSource:[
                {url:'https://louisem.com/wp-content/uploads/2019/02/Google-Display-Ad-Sizes-FB.png'}
            ],
            position: 0,
            data: null,
            masuk: null,
            location:{
                lat1: -6.918018,
                lat2: null,
                long1:  107.585313,
                long2: null , 
            },
            jarak: null,
            ad: false,
            loading: false,
            loadingRemote: false,
            displayName: null,
        }
    }

    componentDidMount(){
        this.setMasuk()
        this.getName()
    }

    getName(){
        const that = this
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              that.setState({displayName: user.email})
              console.log(user.email)
            } else {
              console.log('not')
            }
          });
    }

    setMasuk = async() =>{
        try{
            const masuk = await AsyncStorage.getItem('masuk');
            if(masuk != null){
                this.setState({masuk})
            }else{
                AsyncStorage.setItem('masuk', 'false')
            }
        }catch(err){
            console.log(err)
        }
    }
        
    _getLocationAsync = async () => {
        this.setState({loading: !this.state.loading})
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
            errorMessage: 'Perangkat tidak di izinkan untuk mengakses lokasi.',
            });
        }
        let loc = await Location.getCurrentPositionAsync({});
        const location = Object.assign({}, this.state.location)
        location.lat2 = loc.coords.latitude;
        location.long2 = loc.coords.longitude;
        this.setState({location})
        this._hitungJarak()
    };

    _hitungJarak(){
      toRad=(x)=>{
          return x * Math.PI / 180;
        }
        
        const R = 6371
        const loc = Object.assign({}, this.state.location)

        const x1 = loc.lat2-loc.lat1;
        const dLat = toRad(x1);  
        const x2 = loc.long2-loc.long1;
        const dLon = toRad(x2);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                          Math.cos(toRad(loc.lat1)) * Math.cos(toRad(loc.lat2)) * 
                          Math.sin(dLon/2) * Math.sin(dLon/2);  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c;

        this.setState({jarak: d})
        this._absen()
    }
    _absen(){
        this.setState({loading: !this.state.loading})
        const jarak = this.state.jarak
        if(jarak < 0.03){

            if(this.state.masuk == 'true'){
                AsyncStorage.setItem('masuk', 'false')
                this.setState({masuk: 'false'})
            }else{
                AsyncStorage.setItem('masuk', 'true')
                this.setState({masuk: 'true'})
            }


            this.daylogMasuk()
            this.state.masuk == 'true'?
            Alert.alert(
                'Success',
                'Anda telah masuk kantor.',
                [
                    {text: 'OK'},
                    {cancelable: false}
                ]
            ) :
              Alert.alert(
                'Success',
                'Anda telah keluar dari kantor.',
                [
                    {text: 'OK'},
                    {cancelable: false}
                ]
              )
        }else{
            Alert.alert(
                'Gagal',
                'Anda belum berada di kantor.',
                [
                    {text: 'OK'},
                    {cancelable: false}
                ]
              );
        }
    }
    daylogMasuk(){
        const user = firebase.auth().currentUser;
        const time = new moment().locale('id').format('DD MMMM YYYY')
        const jam = new moment().locale('id').format('HH:mm')
        firebase.database().ref('/log/'+user.displayName+'/'+time).push({
                detail: '',
                edited: 'Sistem',
                jam: jam,
                loc: 'Kantor',
                log: this.state.masuk == 'true'? 'Masuk Kantor' : 'Pulang Kantor'
        })
    }
    daylogRemote=()=>{
        this.setState({loadingRemote: true})
        const user = firebase.auth().currentUser;
        const time = new moment().locale('id').format('DD MMMM YYYY')
        const jam = new moment().locale('id').format('HH:mm')
        firebase.database().ref('/log/'+user.displayName+'/'+time).push({
                detail: '',
                edited: 'Sistem',
                jam: jam,
                loc: '',
                log: 'Remote'
        })
        this.setState({loadingRemote: false})
    }

    render(){
        return(
            <ScrollView>
                    <Card style={{alignItems: 'center'}}>
                        {
                        this.state.ad == true? 
                            <Slideshow
                                arrowSize={0}
                                dataSource={this.state.dataSource}
                                position={this.state.position}
                                onPositionChanged={position => this.setState({ position })}
                                /> :
                            <AdMobBanner
                                bannerSize="largeBanner"
                                adUnitID="ca-app-pub-8483778260495457/5563901536"
                                testDeviceID="EMULATOR"
                                onDidFailToReceiveAdWithError={()=>this.setState({ad: !this.state.ad})} />
                        }
                    </Card>
                <View style={styles.card}>
                    <View style={styles.item}>
                        <Card style={styles.icon} cardBorderRadius={20}>
                            <CardItem style={{borderRadius: 10, paddingLeft: 5, paddingRight: 5}} button onPress={()=>this.props.navigation.navigate('Daylog')}>
                                <Body style={styles.carditem}>
                                    <Icon type="MaterialIcons" name="assessment" style={{fontSize: 70, color:'#2196F3'}} />    
                                    <Text style={{color: 'grey'}}>Daily Log</Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </View>
                    <View style={styles.item}>
                        <Card style={styles.icon} cardBorderRadius={20}>
                            <CardItem style={{borderRadius: 10, paddingLeft: 5, paddingRight: 5}} button onPress={()=>this.props.navigation.navigate('Todo')} >
                                <Body style={styles.carditem}>
                                    <Icon type="MaterialIcons" name="assignment" style={{fontSize: 70, color:'#2196F3'}} />    
                                    <Text style={{color: 'grey'}}>Todo List</Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </View>
                    {
                        this.state.displayName == 'hrd.berkatsoft@gmail.com'||this.state.displayName == 'fdavidjm@gmail.com'?
                        <View style={styles.item}>
                            <Card style={styles.icon} cardBorderRadius={20}>
                                <CardItem style={{borderRadius: 10, paddingLeft: 5, paddingRight: 5}} button onPress={()=>this.props.navigation.navigate('ListKaryawan')}>
                                    <Body style={styles.carditem}>
                                        <Icon type="MaterialIcons" name="assignment-ind" style={{fontSize: 70, color:'#2196F3'}} />    
                                        <Text style={{color: 'grey'}}>Penilaian</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View> :
                    <View style={styles.item}>
                    </View>
                    }
                </View>
                {
                    this.state.displayName == 'hrd.berkatsoft@gmail.com' || this.state.displayName == 'fdavidjm@gmail.com'?
                    <View style={styles.card}>
                        <View style={styles.item}>
                            <Card style={styles.icon} cardBorderRadius={20}>
                                <CardItem style={{borderRadius: 10, paddingLeft: 5, paddingRight: 5}} button onPress={()=>this.props.navigation.navigate('ViewLog')}>
                                    <Body style={styles.carditem}>
                                        <Icon type="MaterialIcons" name="assignment-turned-in" style={{fontSize: 70, color:'#2196F3'}} />    
                                        <Text style={{color: 'grey'}}>View Log</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                        <View style={styles.item}>
                            
                        </View>
                        <View style={styles.item}>
                            
                        </View>
                    </View>
                    :
                    null
                }
                <View style={{padding: 10}}>
                    <Button title={this.state.masuk == 'true'? "Pulang": "Masuk"} loading={this.state.loading} onPress={this._getLocationAsync} />
                </View>
                <View style={{padding: 10}}>
                    <Button title="Remote" loading={this.state.loadingRemote} onPress={this.daylogRemote} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    card:{
        flexDirection: 'row',
        padding: 5
    },
    item:{
        flex: 1,
        margin: 5
    },
    icon:{
        flex: 1,
        flexDirection: 'column',
        borderRadius: 10
    },
    carditem:{
        alignItems: 'center',
        justifyContent: 'center',
    }
})