import React, {useState, useEffect, Component} from 'react';
import {
  ToastAndroid,
  ScrollView,
  Dimensions,
  BackHandler,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import OrderInfoRow from './Components/OrderInfoRow';
import OrderChargeInfoRow from './Components/OrderChargeInfoRow';
import Separator from './Components/Separator';
import OrderItemsList from './Components/OrderItemsList';
import PaymentInfo from './Components/PaymentInfo';
import {Url, Colors, Languages, Store} from '@common';
import { Button, LoadingComponent, SwipeButtonContainer, CancelSwipeButtonContainer } from '@components';
import styles from './styles';
import FireStoreStatusUpdate from './Components/firestorestatusupdate';
import DriversListPage from './Components/DriversListPage';
import AdditionalTimeContainer from './Components/AdditionalTimeContainer';
import CancelResons from './Components/CancelResons';
import { showMessage, hideMessage } from "react-native-flash-message";

const QueryString = require('query-string');
var SharedPreferences = require('react-native-shared-preferences');

class InvoiceView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data : [],
            loading : true,
            driverlistpage : false,
            restaurantid  : '',
            hidebutton : false,
            timeup : 0,
            est_time : '',
            additionaltimepage : false,
            cancelpage : false,
        };
    }

    componentDidMount(){
        this.setState({loading : true});
        this.getOrderData();
        this.getFirestoreData();
        const route = this.props.route.params;
        const orderid = route.order_id;
        console.log(orderid)
        SharedPreferences.getItem('merchantid', (id)=>{
            this.setState({restaurantid : id});
        })
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    getFirestoreData = () => {
        const route = this.props.route.params;
        const orderid = route.order_id;

        const subscriber = firestore()
        .collection('orders')
        .doc(orderid.toString())
        .onSnapshot(documentSnapshot => {
            if(documentSnapshot.data() != null){
                console.log(documentSnapshot.data().est_min_str);
                this.setState({est_time : documentSnapshot.data().est_min_str});
            }
        });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        console.log('Back');
        this.setState({driverlistpage : false})
    };

    getOrderData = () => {
        const route = this.props.route.params;
        const orderid = route.order_id;
        axios.post(Url.getorderdetailsurl, 
        QueryString.stringify({
            orderid : orderid
        }),
        {
            headers: {"Content-Type": "application/x-www-form-urlencoded",}
        })
        .then(response => {
            this.setState({data : response.data.order})
            this.setState({loading : false});
            this.setState({timeup : response.data.time});
        }).catch(error => {
            console.log(error);
        })
    }

    OpenMapsFunction = (lat, lan) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lan}`;
        const label = 'Custom Label';
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    showSuccessMsg = () => {
        showMessage({
            message: Languages.OrderUpdated,
            type: "success",
            icon: "success",
        });
    }

    updatteStatus=(status)=>{
        this.setState({loading : true});
        const {navigation} = this.props;
        const route = this.props.route.params;
        const orderid = route.order_id;
        axios.post(Url.orderstatusupdateurl, 
        QueryString.stringify({
            restaurant_id : this.state.restaurantid,
            order_id : orderid,
            status : status
        }), 
        {
            headers: {"Content-Type": "application/x-www-form-urlencoded",}
        }).then(response => {
            const res_status = response.data.status;
            if(res_status == 1){
                this.setState({loading : false});
                FireStoreStatusUpdate({orderid : orderid, status : status});
                this.setState({hidebutton : true});
                this.showSuccessMsg();
                setTimeout(() => {
                    navigation.goBack();
                }, 1000);
            }else{
                this.setState({loading : false});
                alert('Something went wrong, Please try again')
            }
        }).catch(err => {
            alert(err), 
            this.setState({loading : false})
        })
    }

    render(){
        const orderdata = this.state.data;
        const route = this.props.route.params;
        const orderid = route.order_id;
        const status = route.status;
        const timeup = this.state.timeup;
        const type = route.type;
        const count = route.count;
        return(
            <View style={{flex : 1}}>
                <LoadingComponent visibility={this.state.loading}/>
                {this.state.loading ? null :
                <View style={[styles.container]}>
                <ScrollView>
                    <View style={[styles.row]}>
                        <Text style={[styles.appname]} numberOfLines={1}>{orderdata.delivery_name}</Text>
                    </View>
                    <View style={{width : '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                        <View style={[styles.ordercountcontainer]}>
                            <Text style={[styles.ordercounttext]}>{count}</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <TouchableOpacity onPress={()=>this.setState({additionaltimepage : true})}>
                                <Icon name={'create-outline'} size={25} color={Colors.black}/>
                            </TouchableOpacity>
                            <Text style={[styles.ordercounttext, {fontSize : 20, color : Colors.black, marginLeft : 10}]}>{this.state.est_time}</Text>
                        </View>
                    </View>
                   
                    <View style={{marginTop : 15}}>
                        <OrderInfoRow title={Languages.OrderId} value={`#${orderid}`}/>
                        <OrderInfoRow title={Languages.OrderDate} value={orderdata.created_at}/>
                        <OrderInfoRow title={Languages.DeliveryAddress} value={orderdata.delivery_address}/>
                    </View>

                    <View style={{width : '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop : 20}}>
                        <View>
                            <Text style={[styles.ordertypetext]}>{type}</Text>
                        </View>
                        <View>
                            <View style={{flexDirection : 'row', alignItems : 'center', alignSelf : 'flex-end'}}>
                                <TouchableOpacity onPress={()=>Linking.openURL(`tel:${orderdata.delivery_phone}`)}>
                                    <Icon name={'call'} size={25} color={Colors.darkgray}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.OpenMapsFunction(orderdata.delivery_lat, orderdata.delivery_lon)}>
                                    <Icon name={'navigate-circle'} size={30}  color={Colors.darkgray} style={{marginLeft : 20}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    
                    <Separator/>
                    <View style={[styles.row]}>
                        <Text style={[styles.total]}>{Languages.Total}</Text>
                        <Text style={[styles.total]}>{Languages.Rs} {Number(orderdata.order_total).toFixed(2)}</Text>
                    </View>
                    <Separator/>
                    <OrderItemsList items={orderdata.orderitems}/>
                    <Separator/>
                    <View >
                        <OrderChargeInfoRow title={Languages.SubTotal} value={Number(orderdata.food_amount).toFixed(2)}/>
                        {orderdata.small_order == 0 ? null : <OrderChargeInfoRow title={Languages.ServiceCharge} value={Number(orderdata.small_order).toFixed(2)}/>}
                        {orderdata.discount == 0 ? null : <OrderChargeInfoRow title={Languages.Promotion} value={Number(orderdata.discount).toFixed(2)}/>}
                        {orderdata.delivery == 0 ? null : <OrderChargeInfoRow title={Languages.DeliveryCharge} value={Number(orderdata.delivery).toFixed(2)}/>}
                        <OrderChargeInfoRow title={Languages.Total} value={Number(orderdata.order_total).toFixed(2)}/>
                    </View>
                    <Separator/>
                    <Text style={[styles.paidby]}>{Languages.PaymentMethod}</Text>
                    <PaymentInfo type={orderdata.paymentmode}/>
                    <View style={{marginBottom : 150}}></View>
                </ScrollView>
                <View style={[styles.buttonholder]}>
                    {status == 3 ?
                    <View>
                        {orderdata.driver_confirmed == 0 ? 
                            <View style={{marginBottom : 10}}>
                                <Button 
                                    title={orderdata.driver_id != null && orderdata.driver_confirmed == 0 ? Languages.AssignNewDriver : Languages.AssignDriver}
                                    action={()=>this.setState({driverlistpage : !this.state.driverlistpage})}
                                />
                            </View>
                            :null
                        }
                    </View>:null}
                    {status == 0 ?
                        <CancelSwipeButtonContainer
                            title={Languages.SwipeToCancelOrder}
                            action={()=>this.setState({cancelpage : true})}
                        />
                        : null
                    }
                    {this.state.hidebutton ? null : 
                    <SwipeButtonContainer
                        title={
                            status == 0 ? Languages.MarkAsConfirmed : null ||
                            status == 1 ? Languages.MarkAsPrepared : null ||
                            status == 3 ? Languages.MarkAsOnDelivery : null ||
                            status == 4 ? Languages.MarkAsDelivered : null 
                        }
                        action={()=>
                            status == 0 ? this.updatteStatus(1) : null ||
                            status == 1 ? this.updatteStatus(3) : null ||
                            status == 3 ? this.updatteStatus(4) : null ||
                            status == 4 ? this.updatteStatus(6) : null 
                        }
                    />}
                </View>
                </View>}
                <CancelResons visibility={this.state.cancelpage} orderid={orderid} hideComponent={(state)=>this.setState({cancelpage : state})} updateStatus={(state)=>console.log(state)}/>
                <DriversListPage visibility={this.state.driverlistpage} orderid={orderid} hideComponent={(state)=>this.setState({driverlistpage : state})}/>
                <AdditionalTimeContainer visibility={this.state.additionaltimepage} hideComponent={(state)=>this.setState({additionaltimepage : state})} orderid={orderid}/>
            </View>
        );
    }

}

export default function(props){
    const navigation = useNavigation();
    return <InvoiceView {...props} navigation={navigation} />;
} 