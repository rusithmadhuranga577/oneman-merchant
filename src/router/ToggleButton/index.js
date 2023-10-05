import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, ActivityIndicator, Text} from 'react-native';
import axios from 'axios';
import ToggleSwitch from 'toggle-switch-react-native';
import {Url, Colors, Languages, Store} from '@common';
import { Button, CustomAlert, CustomAlertButton, LoadingComponent, BackgroundJob } from '@components';
import { showMessage, hideMessage } from "react-native-flash-message";

const QueryString = require('query-string');
var SharedPreferences = require('react-native-shared-preferences');

export default class ToggleButton extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            active : false,
            fetching : false,
            showpulse : false,
            restaurantid : '',
            popup : false,
            merchant_busy : false,
            state : null,
            run_background : null
        };
    }

    componentDidMount(){
        this.getRestaurantState();
        SharedPreferences.getItem('merchantid', (id)=>{
            this.setState({restaurantid : id});
        })
    }

    togleMode=()=>{
        const active = this.state.active
        if(active){
            this.openMerchantClosePopup();
        }else{
            this.updateRestaurantState(1);
        }
    }

    openMerchantClosePopup=()=>{
        console.log('Open Popup')
        this.setState({popup : true});
    }

    closeMerchantClosePopup=()=>{
        this.setState({popup : false});
    }

    updateRestaurantState=(status)=>{
        this.setState({fetching : true});
        axios.post(Url.merchantstatusupdateurl, 
        QueryString.stringify({
            restaurant_id : this.state.restaurantid,
            status : status
        }), 
        {
            headers: {"Content-Type": "application/x-www-form-urlencoded",}
        }).then(response => {
            const active = this.state.active
            console.log(response.data.status)
            if(response.data.status == 1){
                this.setState({fetching : false});
                this.setState({active : !active})
                if(status == 1){
                    this.setState({merchant_busy : false});
                    this.setState({run_background : true});
                }else if(status == 1){
                    this.setState({merchant_busy : false});
                    this.setState({run_background : true});
                }else if(status == 2){
                    this.setState({merchant_busy : true});
                    this.setState({run_background : false});
                }else if(status == 3){
                    this.setState({merchant_busy : false});
                    this.setState({run_background : true});
                }else if(status == 0){
                    this.setState({merchant_busy : false});
                    this.setState({run_background : false});
                }
            }
        })
    }

    getRestaurantState=()=>{
        this.setState({popup : false});
        this.setState({fetching : true});
        const restaurantid = 1;
        axios.post(Url.getrestaurantdetailsurl, 
        QueryString.stringify({
            restaurant_id : restaurantid
        }),
        {
            headers: {"Content-Type": "application/x-www-form-urlencoded",}
        })
        .then(response => {
            const state = response.data.open;
            console.log('SHOP', state)
            if(state == 1){
                this.setState({active : true});
                this.setState({fetching : false});
                this.setState({run_background : true});
                this.setState({merchant_busy : false});
            }else if(state == 0){
                this.setState({active : false});
                this.setState({fetching : false});
                this.setState({run_background : false});
                this.setState({merchant_busy : false});
                showMessage({
                    message: Languages.MerchantIsClosed,
                    type: "danger",
                    icon: "danger",
                });
            }else if(state == 2){
                this.setState({active : false});
                this.setState({fetching : false});
                this.setState({run_background : false});
                this.setState({merchant_busy : true});
                showMessage({
                    message: Languages.MerchantIsBusyNow,
                    type: "warning",
                    icon: "warning",
                });
            }else if(state == 3){
                this.setState({active : false});
                this.setState({fetching : false});
                this.setState({run_background : true});
                this.setState({merchant_busy : true});
                showMessage({
                    message: Languages.NoDeliveryAvailableInYourMerchant,
                    type: "warning",
                    icon: "warning",
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    render(){
        const active = this.state.active;
        const fetching = this.state.fetching;
        return(
            <View style={{marginRight : 10}}>
                {fetching ? 
                <ActivityIndicator
                    size={28}
                    color={Colors.Primary}
                />
                :
                <>
                <ToggleSwitch
                    isOn={active}
                    onColor="green"
                    offColor={this.state.merchant_busy ? "orange" : "red"}
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="small"
                    onToggle={this.togleMode}
                />
                </>}
                <BackgroundJob state={this.state.run_background} getState={(state)=>this.setState({showpulse : state})}/>

                <CustomAlert
                    displayMode={'info'}
                    displayMsg={Languages.HowDoYouWantToClose}
                    displaymsgtitle={'Info'}
                    visibility={this.state.popup}
                    dismissAlert={this.closeMerchantClosePopup}
                    cancellable={false}
                    buttons={(
                    <>
                        <CustomAlertButton buttontitle={Languages.Close} theme={'alert'} buttonaction={()=>{this.updateRestaurantState(0); this.closeMerchantClosePopup()}}/>
                        <CustomAlertButton buttontitle={Languages.NoDeliveryAvailable} theme={'alert'} buttonaction={()=>{this.updateRestaurantState(3); this.closeMerchantClosePopup()}}/>
                        <CustomAlertButton buttontitle={Languages.BusyNow} theme={'error'} buttonaction={()=>{this.updateRestaurantState(2); this.closeMerchantClosePopup()}}/>
                        <CustomAlertButton buttontitle={Languages.Cancel} theme={'inverse'} buttonaction={this.closeMerchantClosePopup}/>
                    </>
                    )}
                />
            </View>
        );
    }
}