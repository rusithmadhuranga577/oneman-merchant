import React, {useState, useEffect, Component} from 'react';
import {
  ToastAndroid,
  ScrollView,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';
import ListPage from '../Components/ListPage';
import PulseAnimation from './PulseAnimation';
import BackgroundService from 'react-native-background-actions';
import { NotificationSound } from '@components';

var SharedPreferences = require('react-native-shared-preferences');

const PendingOrders = () => {

    const [showpulse, setshowpulse] = useState(false);
    const [merchantid, setmerchantid] = useState('');

    useEffect(()=>{
        SharedPreferences.getItem('merchantid', (id)=>{
            setmerchantid(id)
            checkPendingOrders(id);
        });
    },[])

    const playNotificationSound = () => {
        console.log('NotificationSound._playing', NotificationSound._playing);
        if(!NotificationSound._playing){
            NotificationSound.play();
        }
    }

    const checkPendingOrders = (id) => {
        if(BackgroundService.isRunning()){
            const subscriber = firestore()
            .collection('orders')
            .where('restuarant_id', '==', id)
            .where('status', '==', 0)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot._docs;
                if(data.length != 0){
                    console.log(BackgroundService.isRunning());
                    setshowpulse(true);
                    playNotificationSound();
                }else{
                    setshowpulse(false);
                    NotificationSound.stop();
                }
            });
            return () => subscriber();
        }
    }

    return(
        <View style={[styles.container]}>
            <ListPage status={0}/>
            <PulseAnimation visible={showpulse} hidePulse={(state)=>{setshowpulse(state), NotificationSound.stop()}}/>
        </View>
    );
}
export default PendingOrders;