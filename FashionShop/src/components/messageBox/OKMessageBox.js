import {Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import color from '../../constants/color';
import FONT_FAMILY from '../../constants/fonts';
import scale from '../../constants/responsive';
import UnderLine from '../../screens/app/orders/components/underLineSwitch';

const Message = (props) => {
    // take in visible(state), title, message, click cancel
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <Modal transparent visible={props.visible}>
            <View style={styles.background}>
                <View style={styles.noticeBox}>
                    {/* <View style={[styles.noticeTitle, props.fail?{backgroundColor: color.Red}: null]}>
                        <Text style={styles.titleText} numberOfLines={1}>{props.title}</Text>
                    </View> */}
                    <UnderLine text={props.title} textStyle={[styles.titleText, props.title === "Error" && {color: color.RedSolid, opacity: 0.7}]} style={{color: props.title === "Error"?color.RedSolid:color.TitleActive}} lineColor={{backgroundColor: props.title === "Error"?color.RedSolid:color.TitleActive}}></UnderLine>
                    <View style={styles.noticeMessage}>
                        <View style={{width: '100%', height: '65%', justifyContent: 'center', marginTop: scale(-20)}}>
                            <Text style={[styles.messageText,props.fail?{color: color.Red}: null]} numberOfLines={5}>
                                {capitalizeFirstLetter(props.message)}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.buttonPosition}
                            onPress={props.clickCancel}>
                            <View style={[styles.buttonBox, props.title === "Error"?{backgroundColor: color.RedSolid, opacity: 0.8}: null]}>
                                <Text style={styles.buttonText}>{props.buttonText?props.buttonText:"OK"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Message;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noticeBox: {
        width: scale(315),
        height: scale(322),
        backgroundColor: color.InputBackground,
        overflow: 'hidden',
    },
    noticeTitle: {
        backgroundColor: color.TitleActive,
        width: '100%',
        paddingHorizontal: scale(30),
        height: scale(66),
    },
    titleText: {
        color: color.TitleActive,
        fontFamily: FONT_FAMILY.yesnoMess,
        fontSize: scale(24),
        alignSelf: 'center',    
    },
    noticeMessage: {
        flex: 1,
        padding: scale(20),
    },
    messageText: {
        color: color.TitleActive,
        fontFamily: FONT_FAMILY.Regular,
        fontSize: scale(20),
        textAlign: 'center',
    },
    buttonPosition: {
        
        marginTop: scale(20),
        alignSelf: 'center',
    },
    buttonBox: {
        backgroundColor: color.TitleActive,
        height: scale(53),
        width: scale(278),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: color.InputBackground,
        fontFamily: FONT_FAMILY.Regular,
    }
});
