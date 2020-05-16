import React, {useState, useEffect} from 'react';
import * as Font from 'expo-font'
import * as firebase from 'firebase';
import 'firebase/firestore';

import { AppLoading } from 'expo'
import { View,StyleSheet,Text } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';

import PokemonCenter from './views/pokemon-center'
import PokemonMarket from './views/pokemon-market'
import PokeballMarket from './views/pokeball-market'
import Bag from './views/bag'
import Hunting from './views/hunting'

const getFonts = () => {
  return Font.loadAsync({
    'Nunito-Black': require('./assets/fonts/Nunito-Black.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-ExtraBold': require('./assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito-ExtraLight': require('./assets/fonts/Nunito-ExtraLight.ttf'),
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf')
  })
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    var firebaseConfig = {
      apiKey: "AIzaSyBA4OkjVem8GEVXhMm38GNWjGOBvgpnCLg",
      authDomain: "pokedex-native-40896.firebaseapp.com",
      databaseURL: "https://pokedex-native-40896.firebaseio.com",
      projectId: "pokedex-native-40896",
      storageBucket: "pokedex-native-40896.appspot.com",
      messagingSenderId: "856068984937",
      appId: "1:856068984937:web:1abc9e59b81981862592f8",
      measurementId: "G-K5QHWTNXMH"
    };
    
    !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig).firestore()
  : firebase.app().firestore();

  },[]);
  if(fontsLoaded){
    return (
      <React.Fragment>
          <Router animationEnabled={false}>
            <Scene key = "root" duration={0}>
              <Scene key="rootinner" duration={0} hideNavBar={true}>
                <Scene key="pokedex" hideNavBar={true} duration={0}>
                  <Scene key = "bag" component = {Bag} animationEnabled={true} hideNavBar={true} duration={0}/>
                  <Scene key = "pokemoncenter" component = {PokemonCenter} animationEnabled={false} hideNavBar={true} duration={0} />
                  <Scene key = "pokemonmarket" component = {PokemonMarket} animationEnabled={false} hideNavBar={true} duration={0} />
                  <Scene key = "pokeballmarket" component = {PokeballMarket} animationEnabled={false} hideNavBar={true} duration={0} />
                </Scene>
              </Scene>
              <Scene key = "hunting" component = {Hunting} hideNavBar={true}/>
            </Scene>
        </Router>
      </React.Fragment>
    );
  }else{
    return(
      <AppLoading
      startAsync = {getFonts}
      onFinish = {() => setFontsLoaded(true)}
      />
    )
  }
}

const styles = StyleSheet.create({
  routerBg:{
    backgroundColor:'#70d1e5',
  },

  viewStyle:{
    flex:1,
    flexDirection:'column',
    justifyContent:'space-between',
  }
});
