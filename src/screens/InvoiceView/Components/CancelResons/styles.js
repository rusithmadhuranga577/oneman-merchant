import { StyleSheet } from "react-native"
import { Colors, Constants } from '@common';

const styles = StyleSheet.create({
    overlay : {
        width: '100%', 
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent : 'center'
    },
    container : {
        width : '90%',
        height : '80%',
        backgroundColor: Colors.white,
        borderRadius : 20
    },
    pleaseselect : {
        fontFamily : Constants.fontFamilynormal,
        color : 'red',
        fontSize : 13,
        alignSelf : 'center'
    },
    pagetitle : {
        fontFamily : Constants.fontFamilybold,
        fontSize : 19,
        alignSelf : 'center',
        color : Colors.black,
        marginTop : 20,
        marginBottom : 10,
        textAlign : 'center'
    },
    cancel : {
        fontFamily : Constants.fontFamilybold,
        color : Colors.black,
        fontSize : 15,
        alignSelf : 'center',
        marginTop : 10
    },
    input: {
        height: 50,
        padding: 10,
        backgroundColor: Colors.gray,
        width : 200,
        borderRadius : 10,
        color : Colors.black,
        alignSelf: 'center',
        marginBottom : 20,
        marginTop : 10
    },
})

export default styles;