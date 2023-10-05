import React, {useState, useEffect, Component} from 'react';
import {
  ToastAndroid,
  ScrollView,
  Dimensions,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {Url, Colors, Languages, Constants} from '@common';
import { Button, LoadingComponent, SwipeButtonContainer } from '@components';
import styles from './styles';
import { showMessage, hideMessage } from "react-native-flash-message";
import {
    SelectMultipleButton,
    SelectMultipleGroupButton
  } from "react-native-selectmultiple-button";

const QueryString = require('query-string');
const data = [
    { value: 1, displayValue : 'User asked to cancel order' },
    { value: 2, displayValue : 'No drivers' },
    { value: 3, displayValue : 'Ordered foods are not available' },
    { value: 4, displayValue : 'Merchant is closed' },
    { value: 5, displayValue : 'Delivery location is far away' }
]

class CancelResons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading : false,
            selectedvalue : [],
            entered_reson : ''
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
        console.log(this.state.selectedvalue)
        // this.setState({loading : true});
        // const orderid = this.props.orderid;
        // firestore()
        // .collection('orders')
        // .doc(orderid.toString())
        // .update({
        //     est_min_str :  `20 min - ${this.state.selectedvalue} min`,
        // })
        // .then(() => {
        //     showMessage({
        //         message: Languages.EstTimeUpdated,
        //         type: "success",
        //         icon: "success",
        //     });
        //     setTimeout(() => {
        //         this.hideComponent();
        //         this.setState({loading : false});
        //     }, 500);
        // });
        this.props.updateStatus(this.state)
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
                        <View style={[styles.container]}>
                            <LoadingComponent visibility={this.state.loading}/>
                            <Text style={[styles.pagetitle]}>{Languages.SelectResonForCancelOrder}</Text>
                            <TextInput 
                                value={this.state.entered_reson}
                                placeholder={Languages.EnterAnotherReson}
                                onChangeText={text => this.setState({entered_reson : text})}
                                style={[styles.input, {fontFamily: Constants.fontFamilynormal, width: '90%'}]}
                                placeholderTextColor={'rgba(0,0,0,0.4)'}
                            />
                            <View style={{alignSelf: 'center', width: '100%'}}>
                                <SelectMultipleGroupButton
                                    multiple={true}
                                    group={data}
                                    buttonViewStyle={{margin: 10, borderRadius: 30, padding: 5, alignSelf: 'center',}}
                                    highLightStyle={{
                                        borderColor: Colors.primary, textColor: Colors.black, backgroundColor: Colors.white,
                                        borderTintColor: Colors.black, textTintColor: Colors.white, backgroundTintColor: Colors.primary
                                    }}
                                    containerViewStyle={{flexDirection:'row', width: '100%'}}
                                    onSelectedValuesChange={selectedValues => this.setState({selectedvalue : selectedValues})}
                                />
                            </View>
                            <View style={{width : '90%', alignSelf: 'center', marginTop : 20}}>
                                <Button title={Languages.CancelOrder} action={this.updateFunction}/>
                                <TouchableOpacity onPress={()=>this.hideComponent()}>
                                    <Text style={[styles.cancel]}>{Languages.Cancel}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>                    
                </Modal>
            </View>
        );
    }

}

export default function(props){
    const navigation = useNavigation();
    return <CancelResons {...props} navigation={navigation} />;
} 