import React from 'react';
import { SafeAreaView, TouchableHighlight, Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Style from '../style/style';

export default class PokedexFooter extends React.Component {
    gotoHunting = () =>{
        Actions.hunting();
    }

    gotoPokedex = () =>{
        Actions.rootinner()
    }

    gotoBattleArea = () =>{
        Actions.battlearea();
    }

    render(){
        return (
            <React.Fragment>
                <View style={styles.pokedexColor}>
                    <SafeAreaView>
                        <View style={styles.pokedexFooter}>
                            <View style={Object.assign({},Style.container)}>
                               <View style={Object.assign({},Style.row)}>
                                   <View style={Object.assign({},Style.col6)}>
                                        <TouchableHighlight style={styles.footerBtn} onPress={this.gotoHunting}>
                                            <View style={styles.footerMenu}>
                                                <Image style={styles.image} source={require('../assets/hunting.png')}/>
                                                <Text style={styles.fmText}>HUNTING</Text>
                                            </View> 
                                        </TouchableHighlight>
                                   </View>
                                   <View style={Object.assign({},Style.col6,styles.red)}>
                                        <TouchableHighlight style={styles.footerBtn} onPress={this.gotoPokedex}>
                                            <View style={styles.footerMenu}>
                                                <Image style={styles.image} source={require('../assets/pokedex-icon.png')}/>
                                                <Text style={styles.fmText}>POKEDEX</Text>
                                            </View>
                                        </TouchableHighlight>
                                   </View>
                               </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </React.Fragment> 
        );
    } 
}

const styles = StyleSheet.create({
    footerBtn:{
        width:'100%',
        borderRadius:5,
        marginTop:5,
        marginBottom:5,
    },

    fmText:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        
    },

    footerMenu:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        paddingTop:10,
        paddingBottom:10,
    },

    image:{
        width:"100%",
        height:30,
        resizeMode: "contain",
    },

    pokedexColor:{
        backgroundColor:'#f03737',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.6,
        elevation: 2,
    },
    
    pokedexFooter:{
        backgroundColor:'#f03737',
        position:'relative',
        bottom:0,
        height:80,
        width:'100%',
    }
});
