import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Tts from 'react-native-tts';
import SoundPlayer from 'react-native-sound-player';

const ReadBook = () => {
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

  return (
    <View></View>
  );
};

export default ReadBook;
