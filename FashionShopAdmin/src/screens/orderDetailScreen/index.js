import { SafeAreaView, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'

//lib
import * as Progress from 'react-native-progress';
//component
import HeaderMin from '../../components/header/headerMin'
import color from '../../constants/color'
import scale from '../../constants/responsive'
import FONT_FAMILY from '../../constants/fonts'
import ItemList from './component/itemList'
import { displayDateTime } from '../../config/displayDateTime'
import Message from '../../components/alearts.js/messageOnly'
import { axiosPrivate } from '../../apis/axios'
import { dollarType } from '../../config/currency'

const OrderDetailScreen = (props) => {
    const { order } = props.route.params;
    console.log({order})
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        let total = 0;
        order.productDetails.map(item => {
            total += item.quantity;
        })
        setTotalItems(total)
    }, [])

    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleBlackButton = async () => {
        const controller = new AbortController();
        const changeOrderStatus = async (status, message) => {
            try {
                setLoading(true);
                const response = await axiosPrivate.put(`/change-order-status/${order._id}`, 
                JSON.stringify({orderStatus: status}),
                {
                    signal: controller.signal,
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                });
                setTitle('Success');
                setMessage(message);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setTitle('Error');
                setMessage(err.response.data.error);
                setLoading(false);
            } finally {
                setVisible(true);
            }
        };
        switch (order.orderStatus) {
            case "new":
                changeOrderStatus('in progress', 'The order has been accepted');
                break;
            case "in progress": 
                changeOrderStatus('shipping', 'The order is getting shipped');
                break;
            case "shipping": 
                changeOrderStatus('complete' ,'The order has been completed');
                break;
        }
    }

    const handleWhiteButton = () => {
        const controller = new AbortController();
        const changeOrderStatus = async (status, message) => {
            try {
                setLoading(true);
                const response = await axiosPrivate.put(`/change-order-status/${order._id}`, 
                JSON.stringify({orderStatus: status}),
                {
                    signal: controller.signal,
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                });
                setTitle('Success');
                setMessage(message);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setTitle('Error');
                setMessage(err.response.data.error);
                setLoading(false);
            } finally {
                setVisible(true);
            }
        };
        switch (order.orderStatus) {
            case "new":
                changeOrderStatus('cancel', 'The order has been cancel');
                break;
            case "in progress": 
                changeOrderStatus('cancel', 'The order has been cancel');
                break;
            case "shipping": 
                changeOrderStatus('return' ,'The order will be return');
                break;
        }
    }

    const windowWidth = Dimensions.get('window').width;
    return (
        <SafeAreaView style={styles.container}>
            <Message
                visible={visible}
                title={title}
                clickCancel={() => {
                    if (title === 'Success') {
                        props.navigation.goBack();
                    } else {
                        setVisible(false);
                    }
                }}
                message={message}
            />
            <HeaderMin text={"Orders details"} onPress={()=>props.navigation.goBack()}/>
            {loading && <Progress.Bar 
                indeterminate={true} 
                width={windowWidth} 
                borderRadius={0} 
                color={color.Secondary} 
                borderWidth={0} 
                height={3}/>}
            <View style={styles.body}>
{/* generalInfo */}
            <ScrollView style={{paddingVertical: scale(20)}}>
                <View style={styles.row}>
                    <Text style={styles.textOrange}>Order ID: </Text>
                    <Text style={styles.text}>{order._id}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.textOrange}>Receiver: </Text>
                    <Text style={styles.text}>{order.userName}</Text>
                </View>
                {order.address.city === undefined ? (null):(<View style={styles.row}>
                    <Text style={styles.textOrange}>Address: </Text>
                    <Text style={styles.text}>{order.address.streetAndNumber}, {order.address.ward}, {order.address.district}, {order.address.city}</Text>
                </View>)}
                <View style={styles.row}>
                    <Text style={styles.textOrange}>Order Status: </Text>
                    <Text style={styles.text}>{order.orderStatus}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.textOrange}>Order date: </Text>
                    <Text style={styles.text}>{displayDateTime(order.orderDate)}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.textOrange}>Note: </Text>
                    <Text style={styles.text}>{order.note ? order.note : "Nothing"}</Text>
                </View>
                <View style={{gap: scale(10)}}>
                    <Text style={styles.bodyText}>Item list</Text>
                    {
                        order.productDetails.map((item, index) => (
                            <>
                                <ItemList item={item} index={index}/>
                            </>
                        ))
                    }
                    <View style={styles.row}>
                        <Text style={styles.footerText}>Total items: </Text>
                        <Text style={styles.textOrange}>{totalItems}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.footerText}>Total Price: </Text>
                        <Text style={styles.textOrange}>{dollarType(order.orderTotalPrice)}</Text>
                    </View>
                    <View style={styles.buttonRow}>
                        {(order.orderStatus === "new" || order.orderStatus === "in progress" || order.orderStatus === "shipping")?(
                            <>
                            <TouchableOpacity style={styles.buttonBlack} onPress={handleBlackButton}>
                                {order.orderStatus === "new" ? (<Text style={styles.buttonBlackText}>Accept order</Text>): null}
                                {order.orderStatus === "in progress" ? (<Text style={styles.buttonBlackText}>Ship order</Text>): null}
                                {order.orderStatus === "shipping" ? (<Text style={styles.buttonBlackText}>Finish order</Text>): null}                                                           
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonWhite} onPress={handleWhiteButton}>
                                {order.orderStatus === "new" ? (<Text style={styles.buttonWhiteText}>Cancel</Text>): null}
                                {order.orderStatus === "in progress" ? (<Text style={styles.buttonWhiteText}>Cancel</Text>): null}
                                {order.orderStatus === "shipping" ? (<Text style={styles.buttonWhiteText}>Return</Text>): null}
                            </TouchableOpacity>
                            </>
                            ):null
                        }
                        
                        
                    </View>
                </View>     
            </ScrollView>
            </View>
            
        </SafeAreaView>
    )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.White,
    },
    body: {
        flex: 0.9,
        paddingLeft: scale(10),
        paddingRight: scale(10),
    },
    row: {
        width: '80%',
        flexDirection: 'row',
        marginBottom: scale(7),
    },
    buttonRow: {
        // width: '80%',
        flexDirection: 'row',
        marginBottom: scale(7),
        justifyContent: 'space-around'
    },
    text: {
        color: color.TitleActive,
        fontFamily: FONT_FAMILY.Address,
        fontSize: 16,
    },
    textOrange: {
        color: color.Secondary,
        fontFamily: FONT_FAMILY.Address,
        fontSize: 16,
    },
    bodyText: {
        color: color.Body,
        fontFamily: FONT_FAMILY.Bold,
        fontSize: scale(24),
        marginLeft: scale(3),
    },
    footerText: {
        color: color.Body,
        fontFamily: FONT_FAMILY.Bold,
        fontSize: scale(20),
        marginLeft: scale(3),
    },
    imageView: {
        width: scale(50),
        height: scale(50)
    },
    buttonBlack: {
        width: scale(150),
        height: scale(40),
        backgroundColor: color.TitleActive,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: scale(5),
    },
    buttonBlackText: {
        color: color.OffWhite,
        fontFamily: FONT_FAMILY.Regular,
        fontSize: scale(18),
    },
    buttonWhite: {
        width: scale(150),
        height: scale(40),
        backgroundColor: color.White,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: scale(5),
        borderWidth: 0.5
    },
    buttonWhiteText: {
        color: color.TitleActive,
        fontFamily: FONT_FAMILY.Regular,
        fontSize: scale(18),
    },
})