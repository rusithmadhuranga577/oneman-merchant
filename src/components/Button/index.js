/** @format */

import React, { useEffect } from 'react';
import { connect } from "react-redux";
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';
import styles from './styles';
import { Images, Languages, Colors } from '@common';


const Button =({title, action, disabled}) => {

  return(
    <TouchableOpacity onPress={disabled == false || disabled == null ? action : null} style={[styles.buttoncontainer, {backgroundColor: disabled == false || disabled == null ? Colors.primary : Colors.darkgray,}]}>
        <Text style={[styles.title]}>{title}</Text>
    </TouchableOpacity>
  );
}
export default Button;