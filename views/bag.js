import React from 'react';
import { SafeAreaView, TouchableHighlight, Image, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import * as firebase from 'firebase';

import Style from '../style/style';

import PokedexLayout from '../components/pokedex-layout';

export default class PokemonCenter extends React.Component {
    state={
        myBag:{},
        wallet:0,
    }

    componentDidMount() {
        firebase.database().ref('/bag/')
        .on('value', snapshot => {
            var bag = snapshot.val()
            this.setState({myBag:bag[0]});
        });

        firebase.database().ref('/wallet/')
        .on('value', snapshot => {
            var wlt = snapshot.val()
            this.setState({wallet:wlt});
        });
    }

    render(){
        return (
            <React.Fragment>
                <PokedexLayout>
                <ScrollView>
                    <View style={styles.wallet}>
                        <Text style={styles.walletText}>Wallet:</Text>
                        <Text style={styles.walletNumber}>{this.state.wallet}</Text>
                    </View>
                    <View style={Object.assign({}, Style.row, Style.flexWrap)}>
                        <View style={Style.col4}>
                            <View style={styles.card}>
                                <View style={styles.cardImage}>
                                    <Text style={styles.headTxt}>Red Pokeball</Text>
                                    <Image style={styles.image} source={require('../assets/pokeball.png')}/>
                                    <View style={styles.price}>
                                        <Text style={styles.priceTxt}>Number: {this.state.myBag.pokeballnum}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={Style.col4}>
                            <View style={styles.card}>
                                <View style={styles.cardImage}>
                                    <Text style={styles.headTxt}>HP Needle</Text>
                                    <Image style={styles.image} source={require('../assets/hp-igne.png')}/>
                                    <View style={styles.price}>
                                        <Text style={styles.priceTxt}>Number: {this.state.myBag.hpNum}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                </PokedexLayout>
            </React.Fragment> 
        );
    } 
}

const styles = StyleSheet.create({
    headTxt:{
        textAlign:'center',
        fontFamily:'Nunito-Black'
    },

    wallet:{
        marginBottom:10,
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-end'
    },

    walletText:{
        fontFamily:'Nunito-Black',
        fontSize:14,
        color:'#ffffff',
        textAlign:'right',
        marginRight:5,
    },

    walletNumber:{
        fontFamily:'Nunito-Regular',
        fontSize:14,
        color:'#ffffff',
        textAlign:'right',
    },

    addArea:{
        paddingLeft:10,
        paddingRight:10,
    },

    addBtn:{
        paddingTop:5,
        paddingBottom:5,
        marginTop:5,
        backgroundColor:'#f03737',
        borderRadius:5,
    },

    addBtnText:{
        textAlign:'center',
        color:'#ffffff',
        fontFamily:'Nunito-Black',
    },

    price:{
        marginTop:5,
        textAlign:"center",
    },

    priceTxt:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        textAlign:'center',
    },

    card:{
        width:'100%',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#fff',
        borderRadius:6,
        overflow:'hidden',
        marginBottom:10,
        backgroundColor:'#8fd5e3',
    },
    
    cardImage:{
        width:'100%',
        paddingTop:10,
        paddingBottom:10,
    },

    image:{
        width:"100%",
        height:80,
        resizeMode: "contain",
    },

    bottom:{
        marginTop:5,
    },
});
