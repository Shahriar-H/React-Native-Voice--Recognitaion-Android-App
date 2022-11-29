import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, ScrollView,StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import BookList from './BookList';

export default function Example() {
  const refRBSheet = useRef();
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        padding: 10,
        backgroundColor: 'grey',
        width: '100%',
        borderTopLeftRadius:4+4,
        borderTopRightRadius:4+4,
      }}>
      <TouchableOpacity onPress={() => refRBSheet.current.open()}>
        <Text style={{textAlign: 'center', color: 'white'}}>Select Book</Text>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={400}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <ScrollView style={styles.bookList}>
            <BookList />
            
        </ScrollView>
        
      </RBSheet>
    </View>
  );
}
 
const styles = StyleSheet.create({
    bookList:{
        padding:10,
        marginBottom:10
    }
})