import React, {useState, useEffect, Component} from 'react';
import {
  ToastAndroid,
  ScrollView,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {Url, Colors, Languages, Store} from '@common';
import { Button, LoadingComponent, SwipeButtonContainer } from '@components';
import styles from './styles';
import { showMessage, hideMessage } from "react-native-flash-message";
import {
    SelectMultipleButton,
    SelectMultipleGroupButton
  } from "react-native-selectmultiple-button";

const themeColor = '#0D1014'
const ios_blue = '#007AFF'
const QueryString = require('query-string');

const data = [
    { value: 20, displayValue : '20 Min' },
    { value: 30, displayValue : '30 Min' },
    { value: 60, displayValue : '60 Min' },
    { value: 90, displayValue : '90 Min' }
]

class AdditionalTimeComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selecteddriver : [],
            loading : false,
            hidebutton : false,
            multipleSelectedData : [
                { value: 'XC40' },
                { value: 'XC60' },
                { value: 'XC90' },
                { value: 'S90' }
            ],
            interest : '',
            selectedvalue : ''
        };
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
         );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    updateFunction=()=>{
        this.setState({loading : true});
        const orderid = this.props.orderid;
        firestore()
        .collection('orders')
        .doc(orderid.toString())
        .update({
            est_min_str :  `20 min - ${this.state.selectedvalue} min`,
        })
        .then(() => {
            showMessage({
                message: Languages.EstTimeUpdated,
                type: "success",
                icon: "success",
            });
            setTimeout(() => {
                this.hideComponent();
                this.setState({loading : false});
            }, 500);
        });
    }

    backAction = () => {
        this.hideComponent();
    };

    hideComponent=()=>{
        this.props.hideComponent(false);
        this.setState({selectedvalue : ''})
    }

    render(){
        const visibility = this.props.visibility;
        return(
            <View>
                <Modal
                    visible={visibility}
                    animationIn={'slideInUp'}
                    useNativeDriver={true}
                    transparent={true}
                    onRequestClose={() => this.hideComponent()}
                >
                    <View style={[styles.overlay]}>
                        <LoadingComponent visibility={this.state.loading}/>
                        <Text style={[styles.pagetitle]}>{Languages.AddAdditionalTime}</Text>
                        <View style={{alignSelf: 'center', width: '100%',}}>
                            <SelectMultipleGroupButton
                                multiple={false}
                                group={data}
                                buttonViewStyle={{width:'60%', margin: 10, borderRadius: 30, padding: 5, alignSelf: 'center',}}
                                highLightStyle={{
                                    borderColor: Colors.primary, textColor: Colors.black, backgroundColor: Colors.white,
                                    borderTintColor: Colors.black, textTintColor: Colors.white, backgroundTintColor: Colors.primary
                                }}
                                containerViewStyle={{flexDirection:'row', width: '100%'}}
                                onSelectedValuesChange={selectedValues => this.setState({selectedvalue : selectedValues[0]})}
                            />
                        </View>
                        <View style={{width : '90%', alignSelf: 'center', position : 'absolute', bottom : 30}}>
                            <Button title={Languages.Update} action={this.updateFunction} disabled={this.state.selectedvalue == '' ? true : false}/>
                            <TouchableOpacity onPress={()=>this.hideComponent()}>
                                <Text style={[styles.cancel]}>{Languages.Cancel}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            
                        </View>
                    </View>                    
                </Modal>
            </View>
        );
    }

}

export default function(props){
    const navigation = useNavigation();
    return <AdditionalTimeComponent {...props} navigation={navigation} />;
} 