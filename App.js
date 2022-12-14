import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView} from 'react-native';
import Voice from '@react-native-voice/voice';
import SoundPlayer from 'react-native-sound-player';
import BottomSheetPop from './components/BottomSheetPop';
import {PermissionsAndroid, Platform} from 'react-native';
import ReadBook from './components/ReadBook';
import Video from 'react-native-video';

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [paused, setpaused] = useState(false);
  const [showBookList, setshowBookList] = useState('none');
  const [ChangeIcon, setChangeIcon] = useState('🎙');
  const [ShowStatus, setShowStatus] = useState('Sleeping Mic');
  const [result, setresult] = React.useState('');
  const [videoLink, setvideoLink] = useState('');

  

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const startSound = async () => {
    try {
      // play the file tone.mp3
      SoundPlayer.playSoundFile('mt', 'mp3');
      // or play from url
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;

    return () =>{
      Voice.destroy().then(Voice.removeAllListeners) 
    }
    
  },[]);

  //play sound during start
 
  async function getPermissionFromDevice() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for record audio',
            message: 'Give permission to your device to record audio',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permission granted');
        } else {
          console.log('permission denie-ylyhgj');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }

  const getChangeIcon = () => {
    if (ChangeIcon === '🎙') {
      setChangeIcon('❌');
      getPermissionFromDevice();
      StartRecording();
      setShowStatus('Listening...');
      // startSound();
      return 0;
    }
    // startSound();
    StopRecording();
    setChangeIcon('🎙');
    setShowStatus('Sleeping Mic');
  };

  const StartRecording = async () => {
    try {
      // await Voice.start('my-MM');
      if (isEnabled) {
        await Voice.start('en-US');
      } else {
        await Voice.start('my-MM');
      }
      
    } catch (error) {
      console.log('Error Raised:' + error);
    }
  };

  

  const onSpeechStartHandler = () => {
    console.log('Start handler...');

  };

  const onSpeechEndHandler  = () => {
    setChangeIcon('🎙');
    setShowStatus('Sleeping Mic');
    console.log('Stop handler...');
  };

  const onSpeechResultsHandler = (e) => {
    console.log('Result handler: ' + e.value[0]);
    let wordSen = e.value[0];
    if (e.value[0]==='pause' || wordSen.search("pause") > -1 || wordSen.search("stop") > -1 || e.value[0]==='ရပ်') {
      SoundPlayer.pause()
      setpaused(true)
    }
    if (e.value[0]==='play' || wordSen.search("play") > -1 || e.value[0]==='ကစားပါ။') {
      SoundPlayer.play()
      setpaused(false)
    }
    setresult(e.value[0]);
    
  };

  const StopRecording = async () => {
    try {
      await Voice.stop();
      onSpeechEndHandler()
     
    } catch (error) {
      console.log('Error Raised:' + error);
    }
  };

  

  


  

  return (
    <ScrollView>
    <View style={styles.mainContainer}>
      <View style={styles.containerSwice}>
        <Text>Burmise</Text>
        <Switch
          trackColor={{false: '#767577', true: '#767577'}}
          thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{paddingLeft: 0, paddingRight: 0}}
        />
        <Text>English</Text>
      </View>
      <View>
        <TouchableOpacity onPress={getChangeIcon} style={styles.myButton}>
          <Text style={styles.micIcon}>{ChangeIcon}</Text>
        </TouchableOpacity>
        <Text style={{...styles.StatusBar}}>{ShowStatus}</Text>
      </View>
      <View style={styles.resultShow}>
        <Text style={styles.resultShowText}>{result}</Text>
      </View>
      <ReadBook/>
      {/* {result !== '' && (
        <TouchableOpacity
          onPress={() => setresult('')}
          style={{
            paddingHorizontal: 20,
            backgroundColor: 'red',
            paddingVertical: 5,
            borderRadius: 4,
          }}>
          <Text>Clear</Text>
        </TouchableOpacity>
      )} */}

      {/* <View>
        <TouchableOpacity onPress={startSound}>
          <Text>Button Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> SoundPlayer.pause()}>
          <Text>pause</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> SoundPlayer.play()}>
          <Text>play</Text>
        </TouchableOpacity>
      </View> */}

      <View>
      <View style={{height:400}}>
      {videoLink!==''&&
        
          <Video source={{uri: videoLink, mainVer: 1, patchVer: 0}}   // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref
            
          }} 
          // controls={true}
          audioOnly={true}
          paused={paused}

          width={400}
          height={300}   
          resizeMode="cover"                                // Store reference
          onBuffer={this.onBuffer}                // Callback when remote video is buffering
          onError={this.videoError}               // Callback when video cannot be loaded
          style={styles.backgroundVideo}/>
        
        }
        </View>
        <View style={{...styles.selectVid,display:'flex', flexDirection:"row", justifyContent:"space-between",padding:10}}>
          <TouchableOpacity onPress={() =>showBookList==='none'?setshowBookList("flex"):setshowBookList("none")} style={{...styles.selectme,paddingHorizontal:20,backgroundColor:"blue",paddingVertical:10}}>
            <Text style={{color:'white'}}>SELECT VIDEO</Text>
          </TouchableOpacity>
          <View style={{...styles.booklist,display:showBookList}}>
            <TouchableOpacity 
              onPress={()=>{
              setvideoLink("https://g-social.softbd.net/Video/English/1.%20A%20Child%20is%20Born%20(English).mp4")
              showBookList==='none'?setshowBookList("flex"):setshowBookList("none")
              }} 
              style={{paddingVertical:10}}>
                <Text style={{...styles.bookListTestSize,color:'white'}}>📚 Book English</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={()=>{ 
              setvideoLink("https://g-social.softbd.net/Video/Burmese/2.%20Caring%20for%20Children.mp4")
              showBookList==='none'?setshowBookList("flex"):setshowBookList("none")
              }} 
              style={{paddingVertical:10}}>
                <Text style={{...styles.bookListTestSize,color:'white'}}>📚 Book Burmese</Text>
            </TouchableOpacity>


            <TouchableOpacity 
              onPress={()=>{
               setvideoLink("https://g-social.softbd.net/Video/Bangla/2.%20Caring%20for%20Children%20(Bangla).mp4")
               showBookList==='none'?setshowBookList("flex"):setshowBookList("none")
               }} 
               style={{paddingVertical:10}}>
                <Text style={{...styles.bookListTestSize,color:'white'}}>📚 Book Bangla</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={()=>{ 
              setvideoLink("");
              showBookList==='none'?setshowBookList("flex"):setshowBookList("none")
              }} 
              style={{paddingVertical:10}}>
                <Text style={{...styles.bookListTestSize,color:'white'}}>❌ Cancel Play</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
          
      {/* <BottomSheetPop /> */}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 70,
  },
  myButton: {
    backgroundColor: 'white',
    shadowColor: 'grey',
    shadowOpacity: 0.7,
    elevation: 10,
    padding: 10,
    height: 150,
    width: 150,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  StatusBar: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 20,
  },
  disNone: {
    display: 'none',
  },
  resultShow: {
    width: '100%',
    padding: 20,
    marginTop: 10,
  },
  resultShowText: {
    textAlign: 'center',
  },
  containerSwice: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  backgroundVideo: {
    padding:200,
    
  },
  booklist:{
    backgroundColor:'black',
    padding:10,
    position:'absolute',
    bottom:53,
    left:10,
    width:"100%",
    borderRadius:4,
  },
  
  
  
});
export default App;
