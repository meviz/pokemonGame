import React from 'react';
import {StyleSheet} from 'react-native';

const spaceLength = 5;

const style = StyleSheet.create({
    container:{width:'100%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    row:{display:'flex', flexDirection:'row', marginLeft:(-spaceLength), marginRight:(-spaceLength)},

    col12:{width:'100%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col11:{width:'91.6666%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col10:{width:'83.333333%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col9:{width:'75%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col8:{width:'66.666666%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col7:{width:'58.333333%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col6:{width:'50%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col5:{width:'41.666666%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col4:{width:'33.333333%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col3:{width:'25%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col2:{width:'16.666666%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col1:{width:'8.333333%', paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},
    col:{paddingLeft:spaceLength, paddingRight:spaceLength, display:'flex', flexDirection:'row'},

    dFlex:{display:'flex'},
    dNone:{display:'none'},

    flexWrap:{flexWrap:'wrap'},
    flexNoWrap:{flexWrap:'nowrap'},
    flexWrapReverse:{flexWrap:'wrap-reverse'},

    flexRow:{flexDirection:'row'},
    flexRowReverse:{flexDirection:'row-reverse'},
    flexColumn:{flexDirection:'column'},
    flexColumnReverse:{flexDirection:'column-reverse'},

    justifyContentStart: {justifyContent: 'flex-start'},
    justifyContentEnd: {justifyContent: 'flex-end'},
    justifyContentCenter: {justifyContent: 'center'},
    justifyContentBetween: {justifyContent: 'space-between'},
    justifyContentAround: {justifyContent: 'space-around'},

    alignItemsStart: {alignItems: 'flex-start'},
    alignItemsEnd: {alignItems: 'flex-end'},
    alignItemsCenter: {alignItems: 'center'},
    alignItemsBaseline: {alignItems: 'baseline'},
    alignItemsStretch: {alignItems: 'stretch'},

    alignContentStart: {alignContent: 'flex-start'},
    alignContentEnd: {alignContent: 'flex-end'},
    alignContentCenter: {alignContent: 'center'},
    alignContentBetween: {alignContent: 'space-between'},
    alignContentAround: {alignContent: 'space-around'},
    alignContentStretch: {alignContent: 'stretch'},

    alignSelfAuto: {alignSelf: 'auto'},
    alignSelfStart: {alignSelf: 'flex-start'},
    alignSelfEnd: {alignSelf: 'flex-end'},
    alignSelfCenter: {alignSelf: 'center'},
    alignSelfBaseline: {alignSelf: 'baseline'},
    alignSelfStretch: {alignSelf: 'stretch'},

    ml1:{marginLeft:''}
});

export default style;