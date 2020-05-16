import React from 'react';
import { SafeAreaView, Platform, TouchableHighlight, Image, StyleSheet, Text, View, TextInput, ScrollView, Alert } from 'react-native';
import * as firebase from 'firebase';

import Style from '../style/style';
import images from '../components/images';
import PokedexFooter from '../components/pokedex-footer';
import { Actions } from 'react-native-router-flux';

export default class Hunting extends React.Component {
    state={
        showStartView:true,
        showLoadingView:false,
        showFindView:false,
        showBattleView:false,
        showChooseView:false,
        showCatchWaitView:false,
        showCatchSuccessView:false,
        showCatchFailView:false,
        showLostView:false,
        showWonView:false,

        pokemonList:[],
        myPokemonList:[],
        preyPokemon:{},
        battlePokemon:{},
        mayBag:{},
        wallet:0,
        isPokemons:false,
        isMyPokemons:false,
        isBag:false,
        isWallet:false,

        midMessageLeft:"",
        midMessageRight:"",
        showLeftScore:false,
        showRightScore:false,
        
        hideAllButton:false,

        message:"",
        showMessageView:false,
    }

    gotoPokemonCenter = () =>{
        Actions.rootinner();
    }

    componentDidMount() {
        firebase.database().ref('/pokemons/')
        .on('value', snapshot => {
            var pokemons = snapshot.val()
            this.setState({
                pokemonList:pokemons,
                isPokemons:true,
            });
        });

        firebase.database().ref('/myPokemons/')
        .on('value', snapshot => {
            var myPokemon = snapshot.val()
            this.setState({
                myPokemonList:myPokemon,
                isMyPokemons:true,
            });
        });

        firebase.database().ref('/bag/')
        .on('value', snapshot => {
            var bag = snapshot.val()
            this.setState({
                myBag:bag[0],
                isBag:true,
            });
        });

        firebase.database().ref('/wallet/')
        .on('value', snapshot => {
            var wlt = snapshot.val();
            this.setState({
                wallet:wlt,
                isWallet:true,
            });
        });
    }

    hideAllView(){
        this.setState({
            showStartView:false,
            showLoadingView:false,
            showFindView:false,
            showBattleView:false,
            showChooseView:false,
            showCatchWaitView:false,
            showCatchSuccessView:false,
            showCatchFailView:false,
            showLostView:false,
            showWonView:false,
        });
    }

    attack(pokemon,toPokemon,s){
        var attPow;
        var tp;
        var self=this

        if(toPokemon.type==pokemon.spAttack){
            attPow=(Math.floor((Math.random()*s)+(s-10)))*2
            tp = this.defense(pokemon,toPokemon,attPow)

        }else{
            attPow = Math.floor((Math.random()*s)+(s-10))
            tp = this.defense(pokemon,toPokemon,attPow);
        }

        if(pokemon.id==this.state.battlePokemon.id){
            this.setState({
                showRightScore:true,
                showLeftScore:false,
                midMessageRight:attPow,
            });
        }

        if(pokemon.id==this.state.preyPokemon.id){
            this.setState({
                showLeftScore:true,
                showRightScore:false,
                midMessageLeft:attPow,
            });
        }

        setTimeout(function(){
            self.setState({
                showLeftScore:false,
                showRightScore:false,
            });
        },500);

        return tp;
    }

    defense(p,tp,ap){
        if(tp.currentHp>=ap){
            if(p.type==tp.spDefense){
                tp.currentHp = (tp.currentHp-(ap/2));
            }else{
                tp.currentHp = (tp.currentHp-ap);
            }
        }else{
            tp.currentHp = 0;
        }

        return tp;
    }

    pressedAttack(s){
        var self=this;
        var bindex;
        
        if(this.state.isPokemons && this.state.isMyPokemons){
            if(this.state.battlePokemon.currentHp!=0){
                this.setState({hideAllButton:true});
                var tp = this.attack(this.state.battlePokemon,this.state.preyPokemon,s);
                this.setState({
                    preyPokemon:tp,
                });

                if(tp.currentHp!=0){
                    setTimeout(function(){
                        var bp;
                        var skills=['skill1','skill2','skill3'];
                        var compAttPower;
    
                        compAttPower = self.state.preyPokemon[skills[Math.floor(Math.random()*3)]];
    
                        bp = self.attack(self.state.preyPokemon,self.state.battlePokemon,compAttPower);
                        
                        self.setState({
                            battlePokemon:bp,
                        });
                        self.setState({hideAllButton:false});

                        bindex = self.state.myPokemonList.findIndex(function(p){
                            return p.id == self.state.battlePokemon.id;
                        });
        
                        firebase.database()
                        .ref('/myPokemons/'+bindex)
                        .update({
                            currentHp: self.state.battlePokemon.currentHp,
                        })
                        .then(() => {
                            this.hideAllView();
                            this.setState({
                                showLostView:true,
                            });
                        });
                        
                        if(self.state.battlePokemon.currentHp==0){
                            var zero = self.state.myPokemonList.filter(function(item){return item.currentHp == 0});
                            if(zero.length<self.state.myPokemonList.length){
                                Alert.alert("This pokemon is DEAD, please change your pokemon.");
                            }else{
                                self.showLostGameView();
                            }
                        }
                    },1000);
                }else{
                    self.showWonGameView();
                }
            }
        }
    }

    showLostGameView(){
        this.hideAllView();
        if(this.state.isWallet){
            em = 100;
            firebase.database()
            .ref('/')
            .update({
                wallet: this.state.wallet + em,
            })
            .then(() => {
                this.hideAllView();
                this.setState({
                    showLostView:true,
                });
            });
        }
    }

    showWonGameView(){
        var em;
        if(this.state.isWallet){
            em = (this.state.preyPokemon.skill3)*10;
            firebase.database()
            .ref('/')
            .update({
                wallet: this.state.wallet + em,
            })
            .then(() => {
                this.hideAllView();
                this.setState({
                    showWonView:true,
                });
            });
        }
        
    }

    showMessageView(m){
        this.setState({
            message:m,
            showMessageView:true,
        });
    }

    hideMessageView(){
        this.setState({
            showMessageView:false,
        });
    }

    catchPokemon(){
        var hasPokemon;
        var self=this;

        hasPokemon = self.state.myPokemonList.filter(function(item){
            return self.state.preyPokemon.id == item.id;
        });

        if(hasPokemon.length==0){
            if(this.state.myBag.pokeballnum!=0){
                firebase.database()
                .ref('/bag/0')
                .update({
                    pokeballnum: this.state.myBag.pokeballnum-1,
                })
                .then(() => {
                    this.hideAllView();
                    this.setState({
                        showCatchWaitView:true,
                    });
                    setTimeout(function(){
                        // self.state.preyPokemon.currentHp = 10;
                        if(self.state.preyPokemon.currentHp <= self.state.preyPokemon.huntHp){
                            firebase.database()
                            .ref('/myPokemons/'+self.state.myPokemonList.length)
                            .set(self.state.preyPokemon)
                            .then(() => {
                                self.hideAllView();
                                self.setState({
                                    showCatchSuccessView:true,
                                });
                            });
                        }else{
                            self.hideAllView();
                            self.setState({
                                showCatchFailView:true,
                            });
                            self.showMessageView("FAIL");
                            setTimeout(function(){
                                self.hideAllView();
                                self.setState({
                                    showBattleView:true,
                                });
                            },2000)
                        }
                    },2000);
                });
            }else{
                Alert.alert("You don't have any pokeball")
            }
        }else{
            Alert.alert("You have this pokemon so, you can't catch him. If you want to earn some money you can continue battle.");
        }
    }

    startHunt(){
        var self = this
        this.hideAllView();
        
        self.setState({
            showLoadingView:true,
        });

        if(this.state.pokemonList.length!=0){
            var index = Math.floor(Math.random() * this.state.pokemonList.length);
            console.log(index);
            this.setState({preyPokemon:this.state.pokemonList[index]});
        }

        setTimeout(function(){
            self.setState({
                showLoadingView:false,
                showFindView:true,
            });
        },500)
    }

    startChoosePokemon(){
        var zero = this.state.myPokemonList.filter(function(item){return item.currentHp == 0})
        if(zero.length<this.state.myPokemonList.length){
            this.hideAllView();
            this.setState({
                showChooseView:true,
            });
        }else{
            Alert.alert("All pokemon is dead, SORRY...");
        }
        
    }

    choosePokemon(index){
        var count;
        this.hideAllView();
        if(this.state.myPokemonList[index].currentHp!=0){
            this.setState({
                battlePokemon:this.state.myPokemonList[index],
                showBattleView:true,
            });
        }else{
            Alert.alert("This pokemon is DEAD, please choose another pokemon.")
        }
        
    }

    startBattle(){
        this.hideAllView();
        this.setState({showBattleView:true});
    }

    startView(){
        var content = <View style={styles.pokedexWhite}>
                    <View style={styles.startView}>
                        <Image style={styles.startImage} source={require('../assets/pokeball-2.png')} />
                        <TouchableHighlight style={styles.startBtn} onPress={()=>this.startHunt()}>
                            <Text style={styles.startBtnTxt}>START HUNTING</Text>
                        </TouchableHighlight>
                    </View>
                </View>
        if(this.state.showStartView){
            return content
        }else{
            return
        }
    }

    setUpperCase(str){
        if(str){
            return str.toUpperCase();
        }
    }

    findLoadingView(){
        var content = <View style={styles.pokedexWhite}>
            <View style={styles.startView}>
                <View style={styles.topImageView}>
                    <Image style={styles.topImage} source={require('../assets/bulbasaurAnim.gif')}/>
                </View>
                <View style={styles.midView}>
                    <Text style={styles.midText}>Oh my god! These forest is huge and maybe I will find a legend pokemon.</Text>
                </View>
                <View style={styles.bottomImageView}>
                    <Image style={styles.bottomImage} source={require('../assets/pikachuAnim.gif')}/>
                </View>
            </View>
        </View>

        if(this.state.showLoadingView){
            return content;
        }else{
            return;
        }
    }

    findView(){
        var content = "";
        if(this.state.isPokemons){
            content = <View style={styles.pokedexWhite}>
            <View style={styles.startView}>
                <View style={styles.pokemonView}>
                    <Text style={styles.pokemonName}>{this.setUpperCase(this.state.preyPokemon.name)}</Text>
                    <Image style={styles.pokemonImage} source={images[this.state.preyPokemon.name]} />
                    <View style={styles.pokemonInfo}>
                        <View style={styles.typeView}>
                            <Text style={styles.innerText}>TYPE: {this.setUpperCase(this.state.preyPokemon.type)}</Text>
                        </View>
                        <View style={styles.infoHpView}>
                            <Text style={styles.innerText}>HP: {this.state.preyPokemon.totalHp}</Text>
                        </View>
                        <View style={Style.row}>
                            <View style={Style.col6}>
                                <View style={styles.attackView}>
                                    <Text style={styles.innerText}>SP-ATTACK:{"\n"}{this.setUpperCase(this.state.preyPokemon.spAttack)}</Text>
                                </View>
                            </View>
                            <View style={Style.col6}>
                                <View style={styles.defenseView}>
                                    <Text style={styles.innerText}>SP-DEFENSE:{"\n"}{this.setUpperCase(this.state.preyPokemon.spDefense)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={Object.assign({},Style.row)}>
                    <View style={Style.col6}>
                        <TouchableHighlight style={styles.startBtn} onPress={()=>this.startChoosePokemon()}>
                            <Text style={styles.startBtnTxt}>HUNT</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={Style.col6}>
                        <TouchableHighlight style={styles.startBtn} onPress={()=>this.startHunt()}>
                            <Text style={styles.startBtnTxt}>SEARCH</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </View>
        }
        
        if(this.state.showFindView){
            return content
        }else{
            return
        }
    }

    getPercentHp(chp,thp){
        console.log(chp,thp);
        if(chp && thp){
            return Math.floor((chp/thp)*100)+'%'
        }
    }

    catchWaitView(){
        var content = <View style={styles.pokedexBlue}>
            <View style={styles.startView}>
                <View style={styles.topHuntView}>
                    <Image style={styles.topHuntViewImg} source={require('../assets/catchWait.gif')}/>
                    <Text style={styles.topHuntViewTxt}>WAIT...</Text>
                </View>
            </View>
        </View>
        
        if(this.state.showCatchWaitView){
            return content;
        }else{
            return;
        }
        
    }

    catchSuccessView(){
        var content= <View style={styles.pokedexGray}>
            <View style={styles.startView}>
                <View style={styles.topHuntView}>
                    <Image style={styles.topHuntViewImg} source={require('../assets/catchSuccess.gif')}/>
                    <Text style={styles.topHuntViewTxt}>YES, SUCCESS...</Text>
                    <View style={styles.successBtnView}>
                        <View style={Style.row}>
                            <View style={Style.col6}>
                                <TouchableHighlight style={styles.redBtn} onPress={()=>this.startHunt()}>
                                    <Text style={styles.redBtnTxt}>CONTINUE HUNT</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={Style.col6}>
                                <TouchableHighlight style={styles.redBtn} onPress={this.gotoPokemonCenter}>
                                    <Text style={styles.redBtnTxt}>GO POKEMON CENTER</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        
                        
                    </View>
                </View>
            </View>
        </View>

        if(this.state.showCatchSuccessView){
            return content;
        }else{
            return;
        }
    }

    catchFailView(){
        var content = <View style={styles.pokedexWhite}>
            <View style={styles.startView}>
                <View style={styles.topHuntView}>
                    <Image style={styles.topHuntViewImg} source={require('../assets/pikachuAnim.gif')}/>
                    <Text style={styles.topHuntViewTxt}>OH MY GOD, YOU COULD NOT CATCH HIM...</Text>
                </View>
            </View>
        </View>

        if(this.state.showCatchFailView){
            return content;
        }else{
            return;
        }
    }


    battleView(){
        var content;
        var skillButton;
        var stateButton;
        var leftScore;
        var rightScore;

        if(this.state.isPokemons && this.state.isMyPokemons && this.state.isBag){
            if(!this.state.hideAllButton){
                skillButton = <React.Fragment>
                    <TouchableHighlight onPress={()=>this.pressedAttack(this.state.battlePokemon.skill1)} style={Object.assign({},styles['skill'],styles['skill1'])}>
                        <Text style={styles.skillTxt}>Skill 1</Text>
                    </TouchableHighlight>
                    <TouchableHighlight  onPress={()=>this.pressedAttack(this.state.battlePokemon.skill2)} style={Object.assign({},styles['skill'],styles['skill2'])}>
                        <Text style={styles.skillTxt}>Skill 2</Text>
                    </TouchableHighlight>
                    <TouchableHighlight  onPress={()=>this.pressedAttack(this.state.battlePokemon.skill3)} style={Object.assign({},styles['skill'],styles['skill3'])}>
                        <Text style={styles.skillTxt}>Skill 3</Text>
                    </TouchableHighlight>
                </React.Fragment>

                stateButton = <View style={Style.row}>
                    <View style={Style.col4}>
                        <TouchableHighlight style={styles.runBtn} onPress={()=>this.startHunt()}>
                            <Text style={styles.chooseTxt}>RUN</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={Style.col4}>
                        <TouchableHighlight style={styles.runBtn} onPress={()=>this.catchPokemon()}>
                            <Text style={styles.chooseTxt}>CATCH</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={Style.col4}>
                        <TouchableHighlight style={styles.runBtn} onPress={()=>this.startChoosePokemon()}>
                            <Text style={styles.chooseTxt}>CHANGE</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            }

            if(this.state.showLeftScore){
                leftScore=<View style={styles.redView}>
                    <Text style={styles.scoreTxt}>{this.state.midMessageLeft}</Text>
                </View>
            }
            
            if(this.state.showRightScore){
                rightScore=<View style={styles.greenView}>
                    <Text style={styles.scoreTxt}>{this.state.midMessageRight}</Text>
                </View>
            }

            

            content=<View style={styles.pokedexWindow}>
                    <View style={styles.huntArea}>
                        <View style={styles.preyView}>
                            <View style={styles.preyInfo}>
                                <Image style={styles.preyImage} source={images[this.state.preyPokemon.name]}/>
                                <View style={styles.hpView}>
                                    <View style={Object.assign({},styles.hpInnerView,{width: this.getPercentHp(this.state.preyPokemon.currentHp, this.state.preyPokemon.totalHp)})}>
                                    </View>
                                    <Text style={styles.innerText}>HP: {this.state.preyPokemon.currentHp}</Text>
                                </View>
                            </View>
                            <View style={styles.preySkills}>
                                <View style={Object.assign({},styles['skill'],styles['skill1'])}>
                                    <Text style={styles.skillTxt}>Skill 1</Text>
                                </View>
                                <View style={Object.assign({},styles['skill'],styles['skill2'])}>
                                    <Text style={styles.skillTxt}>Skill 2</Text>
                                </View>
                                <View style={Object.assign({},styles['skill'],styles['skill3'])}>
                                    <Text style={styles.skillTxt}>Skill 3</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.fightSpace}>
                            <View style={Style.row}>
                                <View style={Style.col6}>
                                    {leftScore}
                                </View>
                                <View style={Style.col6}>
                                    {rightScore}
                                </View>
                            </View>
                        </View>
                        {stateButton}
                        <View style={styles.pokeballNumber}>
                        <Text style={styles.pokeballNumberTxt}>Pokeball Number: {this.state.myBag.pokeballnum}</Text>
                        </View>
                        <View style={styles.preyView}>
                            <View style={styles.preySkills}>
                                {skillButton}
                            </View>
                            <View style={styles.preyInfo}>
                                <Image style={styles.preyImage} source={images[this.state.battlePokemon.name]}/>
                                <View style={styles.hpView}>
                                    <View style={Object.assign({},styles.hpInnerView,{width: this.getPercentHp(this.state.battlePokemon.currentHp, this.state.battlePokemon.totalHp)})}>
                                    </View>
                                    <Text style={styles.innerText}>HP: {this.state.battlePokemon.currentHp}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
        }

        if(this.state.showBattleView){
            return content;
        }else{
            return;
        }
    }

    chooseView(){
        var pokemonView = [];
        var self = this;

        if(this.state.myPokemonList.length!=0){
            this.state.myPokemonList.forEach(function(item,index){
                pokemonView.push(
                    <View key={item.id} style={Style.col6}>
                        <TouchableHighlight style={styles.card} onPress={()=>self.choosePokemon(index)}>
                            <View style={styles.cardBody}>
                                <View style={styles.cardHead}>
                                    <Text style={styles.cardHeadTxt}>{self.setUpperCase(item.name)}</Text>
                                </View>
                                <View style={styles.cardImage}>
                                    <Image style={styles.cardImgInner} source={images[item.name]}/>
                                </View>
                                <View style={styles.hpView}>
                                    <View style={Object.assign({},styles.hpInnerView,{width: self.getPercentHp(item.currentHp, item.totalHp)})}>
                                    </View>
                                    <Text style={styles.innerText}>HP: {item.currentHp}</Text>
                                </View>
                                <View style={styles.typeView}>
                                    <Text style={styles.innerText}>TYPE: {self.setUpperCase(item.type)}</Text>
                                </View>
                                
                                <View style={styles.attackView}>
                                    <Text style={styles.innerText}>SP-ATTACK: {self.setUpperCase(item.spAttack)}</Text>
                                </View>
                            
                                <View style={styles.defenseView}>
                                    <Text style={styles.innerText}>SP-DEFENSE: {self.setUpperCase(item.spDefense)}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            });
        }
        

        var content = ""
        if(this.state.isPokemons && this.state.isMyPokemons && this.state.isBag){
            content = <View style={styles.pokedexWindow}>
                <Text style={styles.largeHead}>CHOOSE YOUR POKEMON FOR BATTLE</Text>
                <ScrollView>
                    <View style={Object.assign({},Style.row,{flexWrap:'wrap'})}>
                        {pokemonView}
                    </View>
                </ScrollView>
            </View>
        }

        if(this.state.showChooseView){
            return content;
        }else{
            return;
        }   
    }

    lostGameView(){
        var content;
        var em;

        if(this.state.isPokemons && this.state.isMyPokemons){
            em = 100;
            content=<View style={styles.pokedexWhite}>
                <View style={styles.startView}>
                    <Text style={styles.hugeText}>LOST GAME</Text>
                    <Image style={styles.topImage} source={require('../assets/bulbasaurAnim.gif')}/>
                    <View style={styles.emView}>
                        <Text style={styles.emText}>EARNED MONEY</Text>
                        <Text style={styles.emLgText}>{em}</Text>
                    </View>
                </View>
            </View>
        }

        if(this.state.showLostView){
            return content;
        }else{
            return;
        }
    }

    wonGameView(){
        var em;
        var content;
        if(this.state.isPokemons && this.state.isMyPokemons){
            em = (this.state.preyPokemon.skill3)*10;

            content=<View style={styles.pokedexWhite}>
                <View style={styles.startView}>
                    <Text style={styles.hugeText}>WON GAME</Text>
                    <Image style={styles.topImage} source={require('../assets/bulbasaurAnim.gif')}/>
                    <View style={styles.emView}>
                        <Text style={styles.emText}>EARNED MONEY</Text>
                        <Text style={styles.emLgText}>{em}</Text>
                    </View>
                </View>
            </View>
        }

        if(this.state.showWonView){
            return content;
        }else{
            return;
        }
    }

    render(){
        return (
            <React.Fragment>
                <SafeAreaView style={styles.viewStyle}>
                        {this.startView()}
                        {this.findView()}
                        {this.battleView()}
                        {this.findLoadingView()}
                        {this.chooseView()}
                        {this.catchWaitView()}
                        {this.catchSuccessView()}
                        {this.catchFailView()}
                        {/* {this.lostGameView()} */}
                        {this.wonGameView()}
                </SafeAreaView>
                <SafeAreaView>
                        <PokedexFooter/>
                </SafeAreaView>
            </React.Fragment> 
        );
    } 
}

const styles = StyleSheet.create({
    redView:{
        backgroundColor:'#f03737',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:5,
        width:'100%',
    },

    greenView:{
        backgroundColor:'green',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:5,
        width:'100%',
    },

    scoreTxt:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        fontSize:18,
        textAlign:'center',
    },

    emView:{
        backgroundColor:'#f03737',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:5,
        width:'100%',
    },

    emText:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        fontSize:18,
        textAlign:'center',
    },
    emLgText:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        fontSize:48,
        textAlign:'center',
    },

    hugeText:{
        fontFamily:'Nunito-Black',
        fontSize:36,
        textAlign:'center',
    },

    redBtn:{
        backgroundColor:'#f03737',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:5,
        width:'100%',
    },

    redBtnTxt:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        fontSize:16,
        textAlign:'center',
    },

    successBtnView:{
        marginTop:20,
        width:'100%',
    },

    pokeballNumberTxt:{
        marginTop:10,
        marginBottom:10,
        color:'#ffffff',
        fontFamily:'Nunito-Black',
    },

    largeHead:{
        textAlign:'center',
        color:'#ffffff',
        fontFamily:'Nunito-Black',
        fontSize:18,
        marginBottom:10,
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

    cardBody:{
        width:'100%',
        padding:10,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },

    cardHeadTxt:{
        textAlign:'center',
        color:'#ffffff',
        fontFamily:'Nunito-Black',
        fontSize:16,
    },
    
    cardImage:{
        marginTop:10,
        width:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },

    cardImgInner:{
        width:"100%",
        height:100,
        resizeMode: "contain",
    },

    topHuntView:{
        width:'100%'
    },

    topHuntViewImg:{
        width:'100%',
        resizeMode:'contain',
        height:200,
    },

    topHuntViewTxt:{
        fontFamily:'Nunito-Black',
        fontSize:16,
        textAlign:'center',
    },

    runBtn:{
        width:'100%',
        backgroundColor:'#f03737',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:5,
    },

    chooseTxt:{
        fontFamily:'Nunito-Black',
        fontSize:14,
        color:'#ffffff',
        textAlign:'center',
    },
    
    midText:{
        textAlign:'center',
        fontFamily:'Nunito-Bold',
        fontSize:16,
    },

    topImageView:{
        display:'flex',
        width:'100%',
    },
     
    topImage:{
        width:'100%',
        height:200,
        resizeMode:'contain',
    },

    bottomImageView:{
        display:'flex',
        width:'100%',
    },
     
    bottomImage:{
        width:'100%',
        height:200,
        resizeMode:'contain',
        transform:[{rotate: '180deg'}],
    },

    huntArea:{
        width:'100%',
        flex:1,
        flexDirection:'column',
    },

    fightSpace:{
        flexGrow:1,
        width:'100%',
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignContent:'center',
    },

    preyView:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },

    preySkills:{
        width:'100%',
        flex:1,
        flexDirection:'column',
        padding:20,
    },

    skill:{
        borderRadius:30,
        height:30,
        display:'flex',
        justifyContent:'center',
        marginTop:2.5,
        marginBottom:2.5,
    },

    skillTxt:{
        textAlign:'center',
        fontFamily:'Nunito-Bold',
        color:'#ffffff',
    },

    skill1:{
        backgroundColor:'rgba(0,0,0,0.4)',
    },
    skill2:{
        backgroundColor:'rgba(0,0,0,0.6)',
    },
    skill3:{
        backgroundColor:'rgba(0,0,0,0.8)',
    },

    preyInfo:{
        width:150,
    },

    preyImage:{
        width:150,
        height:150,
        resizeMode:'contain',
    },

    pokemonInfo:{
        paddingHorizontal:10,
    },

    hpView:{
        width:'100%',
        backgroundColor:'rgb(0,255,0)',
        marginTop:5,
        borderRadius:10,
        position:'relative',
        height:23,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden',
    },

    hpInnerView:{
        backgroundColor:'green',
        height:23,
        left:0,
        position:'absolute'
    },

    infoHpView:{
        width:'100%',
        backgroundColor:'green',
        paddingVertical:2.5,
        marginTop:5,
        borderRadius:10,
    },

    typeView:{
        width:'100%',
        backgroundColor:'rgba(0,0,0,0.2)',
        paddingVertical:2.5,
        marginTop:5,
        borderRadius:10,
    },

    attackView:{
        width:'100%',
        backgroundColor:'red',
        paddingVertical:2.5,
        marginTop:5,
        borderRadius:10,
    },

    defenseView:{
        width:'100%',
        backgroundColor:'rgba(0,0,0,0.5)',
        paddingVertical:2.5,
        marginTop:5,
        borderRadius:10,
    },

    innerText:{
        textAlign:'center',
        fontFamily:'Nunito-Regular',
        color:'#ffffff',
        fontSize:10,
    },

    pokemonView:{
        width:'70%',
        backgroundColor:'#70d1e5',
        borderRadius:5,
        paddingBottom:10,
    },

    pokemonName:{
        textAlign:'center',
        fontFamily:'Nunito-Bold',
        fontSize:16,
        color:'#ffffff',
        marginTop:10,
        marginBottom:10,
    },

    startBtn:{
        backgroundColor:'#f03737',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:5,
        marginTop:15,
        width:'100%',
    },

    startBtnTxt:{
        fontFamily:'Nunito-Black',
        color:'#ffffff',
        fontSize:24,
        textAlign:'center',
    },

    startImage:{
        width:'100%',
        height:100,
        resizeMode:'contain'
    },

    pokemonImage:{
        width:'100%',
        height:150,
        resizeMode:'contain'
    },

    startView:{
        display:'flex',
        flexGrow:1,
        alignItems:'center',
        justifyContent:'center',
    },

    pokedexWindow:{
        padding:15,
        backgroundColor:'#70d1e5',
        flexGrow:1,
        flex:1,
        borderRadius:10,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
        shadowColor: "#58b9cd",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 1,
        elevation: 1,
    },

    pokedexWhite:{
        padding:15,
        backgroundColor:'#ffffff',
        flexGrow:1,
        flex:1,
        borderRadius:10,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
    },

    pokedexBlue:{
        padding:15,
        backgroundColor:'#f5fcff',
        flexGrow:1,
        flex:1,
        borderRadius:10,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
    },

    pokedexGray:{
        padding:15,
        backgroundColor:'#f7f7f9',
        flexGrow:1,
        flex:1,
        borderRadius:10,
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
    },

    viewStyle:{
        flexGrow:1,
        flex:1,
        paddingTop: Platform.OS === 'android' ? 35 : 0
    },
});
