import React from 'react';
import { SafeAreaView, TouchableHighlight, Image, StyleSheet, Text, View, TextInput, ScrollView,Alert } from 'react-native';
import * as firebase from 'firebase';

import Style from '../style/style';
import PokedexLayout from '../components/pokedex-layout';

export default class PokemonCenter extends React.Component {
    state = {
        markets:[],
        myBag:{},
        wallet:0,
    }

    addHp(id){
        if(this.state.markets[id].price <= this.state.wallet){
            firebase.database()
            .ref('/')
            .update({
                wallet: this.state.wallet - this.state.markets[id].price,
            })
            .then(() => {
            });

            firebase.database()
            .ref('/bag/0')
            .update({
                hpNum: this.state.myBag.hpNum+1,
            })
            .then(() => {
            });
        }else{
            Alert.alert('You don\'t have enough money')
        }
    }

    componentDidMount() {
        firebase.database().ref('/pokemonMarket/')
        .on('value', snapshot => {
            var marketList = snapshot.val()
            this.setState({markets:marketList});
            
        });

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
        var marketItem = []
        var self=this

        if(this.state.markets.length!=0){
            this.state.markets.forEach(function(item,index){
                marketItem.push(
                    <View key={index} style={Style.col4}>
                        <View style={styles.card}>
                            <View style={styles.cardImage}>
                                <Text style={styles.headTxt}>{item.name}</Text>
                                <Image style={styles.image} source={require('../assets/hp-igne.png')}/>
                                <View style={styles.price}>
                                    <Text style={styles.priceTxt}>Price: {item.price}</Text>
                                </View>
                                <View style={styles.addArea}>
                                    <TouchableHighlight underlayColor = {'rgba(0,0,0,0.5)'} onPress={()=>self.addHp(index)}  style={styles.addBtn}>
                                        <Text style={styles.addBtnText}>BUY</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            });
        }

        return (
            <React.Fragment>
                <PokedexLayout>
                <View style={styles.numberInfo}>
                    <View style={styles.numberInfoLeft}>
                        <View style={styles.pokeballNumber}>
                            <Text style={styles.pbNumberTxt}>HP Needle Number: {this.state.myBag.hpNum}</Text>
                        </View>
                    </View>
                    <View style={styles.wallet}>
                        <Text style={styles.walletText}>Wallet:</Text><Text style={styles.walletNumber}>{this.state.wallet}</Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={Object.assign({}, Style.row, Style.flexWrap)}>
                        {marketItem}
                    </View>
                </ScrollView>
                </PokedexLayout>
            </React.Fragment> 
        );
    } 
}

const styles = StyleSheet.create({
    numberInfo:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        marginBottom:10,
        justifyContent:'space-between',
    },

    numberInfoLeft:{
        display:'flex',
        flexDirection:'row',
    },

    pokeballNumber:{
        backgroundColor:'#f03737',
        height:20,
        borderRadius:20,
        display:'flex',
        justifyContent:'center',
        paddingHorizontal:10,
    },


    pbNumberTxt:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        fontSize:12,
        textAlign:'center',
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

    headTxt:{
        textAlign:'center',
        fontFamily:'Nunito-Black'
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
