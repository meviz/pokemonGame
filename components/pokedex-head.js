import React from 'react';
import { SafeAreaView, TouchableHighlight, Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';

import Style from '../style/style';

export default class PokedexHead extends React.Component {
    state = {
        gender:'female',
        userName:'MuhammedEviz',
        level:1,
        badgeImgLink:[
            require('../assets/1.png'),
            require('../assets/2.png'),
            require('../assets/3.png'),
            require('../assets/4.png'),
            require('../assets/5.png'),
            require('../assets/6.png'),
            require('../assets/7.png'),
            require('../assets/8.png')
        ],

        profileImgLink:[
            require('../assets/pokemonTrainer/1.png'),
            require('../assets/pokemonTrainer/2.png'),
            require('../assets/pokemonTrainer/3.png'),
            require('../assets/pokemonTrainer/4.png'),
            require('../assets/pokemonTrainer/5.png'),
            require('../assets/pokemonTrainer/6.png'),
            require('../assets/pokemonTrainer/7.png'),
            require('../assets/pokemonTrainer/8.png'),
            require('../assets/pokemonTrainer/9.png'),
            require('../assets/pokemonTrainer/10.png'),
        ],
        badgeImgActiveIndex:0,
        profileImgActiveIndex:0,
    }



    changeBadge = () =>{
        var numb=Math.floor((Math.random() * 8));
        firebase.database()
        .ref('/users')
        .update({
            roset: numb,
        })
        .then(() => {
            console.log("güncellendi");
            this.setState({badgeImgActiveIndex: numb});
        });
    }

    changeProfile = () =>{
        var numb=Math.floor((Math.random() * 10));
        firebase.database()
        .ref('/users')
        .update({
            image: numb,
        })
        .then(() => {
            this.setState({profileImgActiveIndex: numb});
        });
    }

    changeGender = () =>{
        if(this.state.gender == 'female'){
            firebase.database()
            .ref('/users')
            .update({
                gender: 'male',
            })
            .then(() => {
                this.setState({gender: "male"});
            });
        }else{
            firebase.database()
            .ref('/users')
            .update({
                gender: 'female',
            })
            .then(() => {
                this.setState({gender: 'female'});
            });
        }
    }

    gotoPokemonMarket = () =>{
        Actions.pokemonmarket();
    }
    gotoPokeballMarket = () =>{
        Actions.pokeballmarket();
    }
    gotoPokemonCenter = () =>{
        Actions.pokemoncenter();
    }
    gotoBag = () =>{
        Actions.bag();
    }

    componentDidMount(){
        firebase.database().ref('/users/')
        .on('value', snapshot => {
            var user = snapshot.val()
            this.setState({badgeImgActiveIndex: user.roset});
            this.setState({profileImgActiveIndex: user.image});
            this.setState({gender: user.gender});
            this.setState({level:user.level});
            this.setState({userName:user.name});
        });
    }
    
    render(){
        return (
            <React.Fragment>
                <View style={styles.pokedexColor}>
                    <SafeAreaView>
                        <View style={styles.pokedexHead}>
                            <View style={Object.assign({},Style.container,)}>
                                <View style={Object.assign({},Style.dFlex, Style.flexColumn, Style.alignItemsCenter)}>
                                    <View style={styles.profile}>
                                        <Image style={styles.profileImg} source={this.state.profileImgLink[this.state.profileImgActiveIndex]} />
                                    </View>
                                    <TouchableHighlight style={styles.profileBtn} onPress={this.changeProfile}>
                                        <Text style={styles.profileBtnTxt}>DEĞİŞTİR</Text>
                                    </TouchableHighlight>
                                </View>
                                <View>
                                    <View style={styles.profileLvl}>
                                        <Image style={styles.profileLvlImg} source={require('../assets/hat.png')} />
                                        <Text style={styles.profileLvlText}>{this.state.level}</Text>
                                    </View>
                                    <TouchableHighlight underlayColor = {'rgba(0,0,0,0.7)'} onPress={this.changeBadge}  style={styles.pokeball}>
                                        <Image style={styles.genderImg} source={this.state.badgeImgLink[this.state.badgeImgActiveIndex]} />
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor = {'rgba(0,0,0,0.7)'} onPress={this.changeGender} style={styles.gender}>
                                        <Image style={styles.genderImg} source={this.state.gender == 'male' ? require('../assets/male.png') : require('../assets/female.png')} />
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.secondColumn}>
                                    <View style={styles.userName}>
                                        <TextInput 
                                            editable={false}
                                            onChangeText={(text) => this.setState({userName:text})}
                                            style={styles.userNameInput}
                                            maxLength={25}
                                            value={this.state.userName}/>
                                    </View>
                                    <View style={styles.menuBtns}>
                                        <View style={Object.assign({},Style.row, styles.grow)}>
                                            <View style={Object.assign({},Style.col, styles.grow)}>
                                                <TouchableHighlight style={styles.menuBtn} onPress={this.gotoPokemonCenter} underlayColor = {'rgba(0,0,0,0.7)'} >
                                                    <View style={styles.menuBtnInner}>
                                                        <Image style={styles.menuImg} source={require('../assets/pc.png')} />
                                                        <Text style={styles.menuText}>POKEMON CENTER</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                            
                                            <View style={Object.assign({},Style.col, styles.grow)}>
                                                <TouchableHighlight style={styles.menuBtn} onPress={this.gotoPokemonMarket} underlayColor = {'rgba(0,0,0,0.7)'} >
                                                    <View style={styles.menuBtnInner}>
                                                        <Image style={styles.menuImg} source={require('../assets/pm.png')} />
                                                        <Text style={styles.menuText}>POKEMON MARKET</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                            <View style={Object.assign({},Style.col, styles.grow)}>
                                                <TouchableHighlight style={styles.menuBtn} underlayColor = {'rgba(0,0,0,0.7)'} onPress={this.gotoPokeballMarket}>
                                                    <View style={styles.menuBtnInner}>
                                                        <Image style={styles.menuImg} source={require('../assets/pokeball.png')} />
                                                        <Text style={styles.menuText}>POKEBALL</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                            <View style={Object.assign({},Style.col, styles.grow)}>
                                                <TouchableHighlight style={styles.menuBtn} underlayColor = {'rgba(0,0,0,0.7)'}onPress={this.gotoBag} >
                                                    <View style={styles.menuBtnInner}>
                                                        <Image style={styles.menuImg} source={require('../assets/bag.png')} />
                                                        <Text style={styles.menuText}>BAG</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
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
    grow:{
        flexGrow:1,
    }, 
    menuBtns:{
        flex:1,
        flexDirection:"row",
        marginTop:10,
        marginLeft:15,
    },

    menuBtn:{
        flexGrow:1,
        flex:1,
        backgroundColor:'rgba(0,0,0,0.4)',
        borderRadius:5,
        paddingLeft:5,
        paddingRight:5,
    },

    menuBtnInner:{
        width:'100%',
        height:'100%',
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        
    },

    menuImg:{
        width:"100%",
        height:35,
        marginTop:2.5,
        marginBottom:2.5,
        resizeMode: "contain",
    },

    menuText:{
        color:"#ffffff",
        fontSize:7,
        fontFamily:'Nunito-Black',
        textAlign:'center',
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

    userName:{
    },

    secondColumn:{
        flexGrow: 1,
        flex:1,
        flexDirection:"column",
    },

    userNameInput:{
        backgroundColor:'#902222',
        borderWidth:1,
        borderColor:'#ffffff',
        color:'#ffffff',
        borderRadius:5,
        height:40,
        marginLeft:15,
        paddingLeft:15,
        fontFamily:'Nunito-Regular'
    },

    gender: {
        backgroundColor:'rgba(0,0,0,0.4)',
        marginTop:5,
        marginLeft:15,
        borderRadius:60,
        width:30,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        display:'flex',
        position: 'relative'
    },

    pokeball:{
        backgroundColor:'rgba(0,0,0,0.4)',
        marginTop:5,
        marginLeft:15,
        borderRadius:60,
        width:30,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        display:'flex',
        position: 'relative'
    },

    genderImg: {
        width:20,
        height:20,
        resizeMode: "contain",
    },

    profileLvl: {
        backgroundColor:'rgba(0,0,0,0.4)',
        marginLeft:15,
        borderRadius:5,
        width:30,
        height:40,
        alignItems:'center',
        display:'flex',
    },

    profileLvlImg: {
        width:20,
        height:15,
        marginTop:4,
        resizeMode: "contain",
    },

    profileLvlText: {
        fontFamily: 'Nunito-Bold',
    },

    pokedexHead:{
        backgroundColor:'#f03737',
        paddingBottom:10,
        paddingTop:15,
    },

    profile: {
        width:75,
        height:75,
        borderRadius: 100,
        backgroundColor:'#70d2e5',
        borderWidth:4,
        borderStyle:'solid',
        borderColor:'#ffffff',
        overflow:'hidden',
        display:'flex',
    },

    profileImg: {
        width:'80%',
        height:'80%',
        resizeMode:'contain',
        marginLeft:'10%',
        marginTop:'10%',
    },

    profileBtn: {
        paddingBottom:5,
        paddingTop:5,
        paddingLeft:10,
        paddingRight:10,
        marginTop:10,
        backgroundColor:'#27cf54',
        borderRadius:50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },

    profileBtnTxt: {
        fontSize:12,
        color:'#ffffff',
        fontWeight:'bold'
    },
});
