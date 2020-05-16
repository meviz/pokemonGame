import React from 'react';
import { SafeAreaView, TouchableHighlight, Image, StyleSheet, Text, View, TextInput, ScrollView, Alert } from 'react-native';

import Style from '../style/style';
import PokedexLayout from '../components/pokedex-layout';
import * as firebase from 'firebase';
import images from '../components/images';

export default class PokemonCenter extends React.Component {
    state={
        pokemonList:[],
        myBag:{},
    }

    setHpPlus(id){
        if(this.state.myBag.hpNum!=0 && this.state.pokemonList[id].totalHp != this.state.pokemonList[id].currentHp){
            console.log(id);
            firebase.database()
            .ref('/myPokemons/'+id)
            .update({
                currentHp: this.state.pokemonList[id].totalHp,
            })
            .then(() => {
            });
            firebase.database()
            .ref('/bag/0')
            .update({
                hpNum:this.state.myBag.hpNum-1,
            })
            .then(() => {
            });
        }

        if(this.state.myBag.hpNum==0){
            Alert.alert("You don't enough HP needle");
        }

        if(this.state.myBag.hpNum!=0 && this.state.pokemonList[id].totalHp == this.state.pokemonList[id].currentHp){
            Alert.alert(this.state.pokemonList[id].name + "'s HP is full");
        }

        
    }

    componentDidMount() {
        firebase.database().ref('/myPokemons/')
        .on('value', snapshot => {
            var pokemons = snapshot.val()
            this.setState({pokemonList:pokemons});
        });

        firebase.database().ref('/bag/')
        .on('value', snapshot => {
            var bag = snapshot.val()
            this.setState({myBag:bag[0]});
        });
    }
    

    render(){
        var pokemons = []
        var self=this

        if(this.state.pokemonList.length!=0){
            this.state.pokemonList.forEach(function(item,index){
                var percent = Math.floor((item.currentHp/item.totalHp)*100)
                var percentTxt = percent + "%"
                
    
                pokemons.push(
                    <View key={item.id} style={Style.col4}>
                        <View style={styles.card}>
                            <View style={styles.cardImage}>
                                <Image style={styles.image} source={images[item.name]}/>
                                <View style={styles.bottom}>
                                    <View style={styles.info}>
                                        <Text style={styles.infoText}>HP</Text>
                                        <View style={styles.hp}>
                                            <View style={Object.assign({},styles.hpInner,{width:percentTxt})}></View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.action}>
                                    <View style={styles.actionInner}>
                                        <TouchableHighlight underlayColor = {'rgba(0,0,0,0.5)'} onPress={()=>self.setHpPlus(index)}  style={styles.hpPlus}>
                                            <Text style={styles.hpPlusText}>HP+</Text>
                                        </TouchableHighlight>
                                    </View>
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
                <ScrollView>
                    <View style={styles.numberInfo}>
                        <View style={styles.numberInfoLeft}>
                            <View style={styles.hpNumber}>
                                <Text style={styles.hpNumberTxt}>{this.state.myBag.hpNum}</Text>
                            </View>
                        </View>
                        <View style={styles.numberInfoRight}>
                            <Text style={styles.nrPokeNumber}>Total Pokemon Number:</Text>
                            <Text style={styles.pokeNumber}>{this.state.pokemonList.length}</Text>
                        </View>
                    </View>
                    <View style={Object.assign({}, Style.row, Style.flexWrap)}>
                        {pokemons}
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

    numberInfoRight:{
        display:'flex',
        flexDirection:'row',
    },

    nrPokeNumber:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
    },

    pokeNumber:{
        fontFamily:'Nunito-Regular',
        color:'#ffffff',
    },

    hpNumber:{
        backgroundColor:'green',
        paddingTop:2.5,
        paddingBottom:2.5,
        paddingLeft:5,
        paddingRight:5,
        borderRadius:20,
    },

    hpNumberTxt:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        fontSize:12,
    },

    action:{
        display:'flex',
        flexDirection:'row',
        marginLeft:-2.5,
        marginRight:-2.5,
        marginTop:5,
        paddingLeft:10,
        paddingRight:10,
    },

    actionInner:{
        width:'100%',
        paddingLeft:2.5,
        paddingRight:2.5,
    },

    hpPlus:{
        width:'100%',
        backgroundColor:'green',
        height:35,
        borderRadius:70,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },

    hpPlusText:{
        textAlign:'center',
        fontSize:15,
        fontFamily:'Nunito-Bold',
        color:'#fff',
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

    info:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:10,
        paddingRight:10,
    },

    infoText:{
        fontSize:10,
        color:'#fff',
        fontFamily:'Nunito-Bold',
    },

    hp:{
        flexGrow:1,
        marginLeft:5,
        backgroundColor:'rgb(0,255,0)',
        height:7,
        overflow:'hidden',
        borderRadius:5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgb(0,255,0)',
    },

    hpInner:{
        height:5,
        backgroundColor:'green',
    },

    mp:{
        flexGrow:1,
        marginLeft:5,
        backgroundColor:'rgb(99, 204, 224)',
        height:7,
        overflow:'hidden',
        borderRadius:5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'rgb(99, 204, 224)',
    },

    mpInner:{
        width:'35%',
        height:5,
        backgroundColor:'rgb(2, 188, 224)',
    },
});
