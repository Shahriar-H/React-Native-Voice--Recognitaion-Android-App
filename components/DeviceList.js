import React from 'react';
import {View, StyleSheet,TouchableOpacity,Text} from 'react-native';

const DeviceList = ({name,id,setid}) => {
    const getBIdisset= ()=>{
        setid(id,name)
    }
    return (
        <View>
            <TouchableOpacity onPress={getBIdisset} style={styles.device}>
                <Text style={{color:'black'}}>📲  {name}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    device:{
        backgroundColor:'#7dafda',
        padding:10,
        borderRadius:4,
        marginBottom:5,
        marginTop:5
    }
})

export default DeviceList;
