import React from 'react';
import { SafeAreaView, Platform, TouchableHighlight, Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import Style from '../style/style';

import PokedexHead from './pokedex-head'
import PokedexFooter from './pokedex-footer'
import PokedexBody from './pokedex-body'

export default class PokedexLayout extends React.Component {
    render(){
        return (
            <React.Fragment>
                
                <SafeAreaView style={styles.viewStyle}>
                    <PokedexHead/>
                    <PokedexBody>
                        {this.props.children}
                    </PokedexBody>
                    <PokedexFooter/>
                    </SafeAreaView>
            </React.Fragment> 
        );
    } 
}

const styles = StyleSheet.create({
    viewStyle:{
      flex:1,
      flexDirection:'column',
      justifyContent:'space-between',
      paddingTop: Platform.OS === 'android' ? 35 : 0
    }
  });

