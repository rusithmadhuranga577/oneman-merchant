import { StyleSheet } from "react-native"
import { Colors, Constants } from '@common';

const styles = StyleSheet.create({
    overlay : {
        width: '100%', 
        height: '100%',
        backgroundColor: Colors.gray,
        alignItems: 'center',
    },
    pleaseselect : {
        fontFamily : Constants.fontFamilynormal,
        color : 'red',
        fontSize : 13,
        alignSelf : 'center'
    },
    pagetitle : {
        fontFamily : Constants.fontFamilybold,
        fontSize : 25,
        alignSelf : 'center',
        color : Colors.black,
        marginTop : 20,
        marginBottom : 30
    },
    cancel : {
        fontFamily : Constants.fontFamilybold,
        color : Colors.black,
        fontSize : 15,
        alignSelf : 'center',
        marginTop : 10
    }
})

export default styles;