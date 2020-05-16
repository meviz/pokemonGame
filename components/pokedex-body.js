import React from 'react';
import { SafeAreaView, TouchableHighlight, Image, StyleSheet, Text, View, TextInput } from 'react-native';

import Style from '../style/style';

export default class PokedexFooter extends React.Component {

    render(){
        return (
            <React.Fragment>
                <View style={styles.pokedexBody}>
                    <View style={styles.pokedexWindow}>
                        {this.props.children}
                    </View>
                </View>
            </React.Fragment> 
        );
    } 
}

const styles = StyleSheet.create({
    pokedexBody:{
        padding:10,
        flexGrow:1,
        flex:1,
    },

    pokedexWindow:{
        padding:15,
        backgroundColor:'#70d1e5',
        flexGrow:1,
        borderRadius:10,
        shadowColor: "#58b9cd",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 1,
        elevation: 1,
    }
});
