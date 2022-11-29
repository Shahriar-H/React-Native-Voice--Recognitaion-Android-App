import React from 'react';
import SoundPlayer from 'react-native-sound-player';
import { View,Text,StyleSheet,TouchableOpacity } from 'react-native';

const BookList = ({video}) => {
    const playSound = () => {
        try {
          // play the file tone.mp3
          SoundPlayer.playSoundFile('mt', 'mp3');
          // or play from url
        //   SoundPlayer.playUrl('https://example.com/music.mp3');
        } catch (e) {
          console.log(`cannot play the sound file`, e);
        }
      };
      console.log(video);
    return (
        <View style={{marginBottom:4}}>
            <TouchableOpacity>
                <Text style={styles.bookListTestSize}>📚 Book 1</Text>
            </TouchableOpacity>
           
        </View>
    );
}
const styles = StyleSheet.create({
    bookListTestSize:{
        fontSize:20-2,
        padding:10,
        borderColor:"rgba(0,0,0,0.1)",
        borderWidth:1,
        borderRadius:5,
        backgroundColor:"rgba(2,2,200,0.1)",
    }
})
export default BookList;
