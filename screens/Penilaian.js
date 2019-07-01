import React from 'react';
import {View,  ScrollView, Text, ActivityIndicator, Dimensions} from 'react-native';
import {PagerTabIndicator, ViewPager, PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';
import { Card, CardItem, Body, Radio, Left, Icon } from 'native-base';
import { Button } from 'react-native-elements';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import * as firebase from 'firebase';
import moment from 'moment';

export default class Penilaian extends React.Component{
    static navigationOptions = ({navigation})=>{
        return{
            title: 'Penilaian Karyawan',
            headerStyle:{
                backgroundColor: '#2196F3'
            },
            headerTintColor: '#fff'
            }
        }
    constructor(props){
        super(props),
        this.state={
            nama: props.navigation.getParam('nama'),
            height: Dimensions.get('window').height - 130,
            validate: false,
            data: [],
            penilaian: [],
            hasil: [],
            jumlah: 0,
            loading: true,
            loadingBtn: false,
        }
    }
    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} />;
    }

    onSelect(id, value){
        const hasil = [...this.state.hasil]
        hasil[id].point = value+1
        this.setState({hasil})
    }
    componentDidMount = async()=>{
        await this.getPoint()
        await this.getData()
    }

    getData(){
        this.setState({loading: true})
        firebase.database().ref('/penilaian').once('value', snap=>{
            
            const penilaian = snap.val()
            this.setState({penilaian, loading: false});

        },function(errorObject){
            console.log(errorObject)
            this.setState({loading: false});
        });
        console.disableYellowBox = true;
    }
    getPoint(){
        this.setState({loading: true})
        firebase.database().ref('/point').once('value', snap=>{
            const data = snap.val()
            this.setState({data});
            this.pushData()

        },function(errorObject){
            console.log(errorObject)
        });
        console.disableYellowBox = true;
    }
    pushData(){
        this.state.data.map((data, index)=>
        this.state.hasil.push({id: data, point: null})
        )
        console.log(this.state.hasil)
    }
    saveData=async()=>{
        this.setState({loadingBtn: true})
        const hasil = [...this.state.hasil]
        const nama = this.props.navigation.getParam('nama')
        const bulan = new moment().format('MMMM YYYY')
        await firebase.database().ref('/nilai/'+nama+'/'+bulan).push({
                0: {
                    id: hasil[0].id,
                    point: hasil[0].point
                    },
                1: {
                    id: hasil[1].id,
                    point: hasil[1].point
                    },
                2: {
                    id: hasil[2].id,
                    point: hasil[2].point
                    },
                3: {
                    id: hasil[3].id,
                    point: hasil[3].point
                    },
                4: {
                    id: hasil[4].id,
                    point: hasil[4].point
                    },
                5: {
                    id: hasil[5].id,
                    point: hasil[5].point
                    },
                6: {
                    id: hasil[6].id,
                    point: hasil[6].point
                    },
                7: {
                    id: hasil[7].id,
                    point: hasil[7].point
                    },
        })
        this.setState({loadingBtn: false})
    }
    
    render(){
        if (this.state.loading) {
            return(
                <ActivityIndicator />
            );
        }
        return(
                <View style={{flex:1}}>
                    <ViewPager
                        style={{height: this.state.height}}
                        ref={(viewPager) => {this.viewPager = viewPager}}
                        scrollEnabled={false}
                    >
                        {
                            this.state.data.map((data, id)=>
                            <View key={id} style={{padding: 5}}>
                                <CardItem style={{backgroundColor: '#E0E0E0'}}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{this.state.nama}: {data}</Text>
                                </CardItem>
                                <ScrollView>
                                    <RadioGroup
                                        size={0} thickness={0}
                                        highlightColor="#2196F3"
                                        onSelect = {(value) => this.onSelect(id, value)} >
                                        {
                                            this.state.penilaian[id].map((option, index)=>
                                                <RadioButton key={index} value={index}>
                                                    <Card>
                                                        <CardItem>
                                                            <Text>{option}</Text>
                                                        </CardItem>
                                                    </Card>
                                                </RadioButton>
                                            )
                                        }
                                            
                                    </RadioGroup>
                                </ScrollView>
                                {
                                    this.state.data.length == id+1 || this.state.validate == true ?
                                    <Button title="Finish" onPress={()=>this.viewPager.setPage(this.state.data.length)} /> :
                                    <Button title="Next" onPress={()=>this.viewPager.setPage(id+1)}/> 
                                }
                            </View>
                            )
                        }
                        <View style={{padding: 10}}>
                            <Card>
                                <CardItem header bordered style={{paddingBottom: 7, paddingTop: 7}}>
                                    <Text style={{fontWeight: 'bold'}}>Penilaian {this.state.nama}</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        {
                                            this.state.hasil.map((data, index)=>
                                            <View key={index} style={{flexDirection: 'row'}}>
                                                <Text style={{flex: 1}}>{data.id}</Text>
                                                <Text style={{flex: 1}}>: {data.point}</Text>
                                                <Icon name="create" style={{fontSize: 16, color: 'grey'}} onPress={()=>{this.viewPager.setPage(index)
                                                                                                                        this.setState({validate: true})
                                                                                                                        }} />
                                            </View>
                                            )
                                        }
                                    </Body>
                                </CardItem>
                            </Card>
                            <Button title="Confirm" loading={this.state.loadingBtn} onPress={this.saveData}/>
                        </View>
                    </ViewPager>
                </View>

        )
    }
}