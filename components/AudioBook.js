import React,{useState} from 'react';
import { ScrollView,StyleSheet,Text, View ,TouchableOpacity, FlatList} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { useNavigation } from '@react-navigation/native';


function AudioBook({modalop,route}) {
  const { manageVideoUrl:vlink } = route.params;
  const navigation = useNavigation()
  const [musicControl, setmusicControl] = useState(false);
  const handleModal = ()=>{
    modalop()
  }  

  const settingLink = (link)=>{
    vlink(link)
    // handleModal();
    navigation.goBack();
  }

  const startSound = async () => {
    try {
      // play the file tone.mp3
      SoundPlayer.playSoundFile('mt', 'mp3');
      setmusicControl(true);
      // or play from url
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  const changePlay = ()=>{
    if (musicControl) {
        setmusicControl(false)
        SoundPlayer.pause();
        return 0;
    }
    setmusicControl(true);
    SoundPlayer.play()
  }


  return (
    <View style={styles.audioContainer}>
        {/* <View style={styles.onffDiv}>
            <TouchableOpacity onPress={changePlay}>
                {
                    musicControl?<Text style={styles.onOffButton}>⏸</Text>:<Text style={styles.onOffButton}>⏹</Text>
                }
                
            </TouchableOpacity>
            <TouchableOpacity onPress={handleModal}>
                <Text style={styles.onOffButton}>❌</Text>
            </TouchableOpacity>
        </View> */}
        {/* <View style={styles.sliderCont}>
            <Text style={{color:"black"}}>Slidergrgsefsfef</Text>
        </View> */}
        <ScrollView style={styles.AudioBookList}>

            <TouchableOpacity style={{...styles.sounDBookBtn,backgroundColor:'rgba(0,0,0,0.5)'}}>
                <Text style={{...styles.sounDBook,color:'white'}}>🧿  Grade 1</Text>
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={()=>settingLink('https://firebasestorage.googleapis.com/v0/b/voice-app-1b659.appspot.com/o/g1%5B1%5D.mp4?alt=media&token=c4c33f95-fa18-4dd1-a535-e00600eb708e')} style={{...styles.sounDBookBtn}}>
                    <Text style={{...styles.sounDBook}}> ▶  Morality and Civics</Text>
                </TouchableOpacity>
                
            </View>

            <TouchableOpacity style={{...styles.sounDBookBtn,backgroundColor:'rgba(0,0,0,0.5)'}}>
                <Text style={{...styles.sounDBook,color:'white'}}>🧿  Grade 2</Text>
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={()=>settingLink('https://firebasestorage.googleapis.com/v0/b/voice-app-1b659.appspot.com/o/g2%5B1%5D.mp4?alt=media&token=3bfc4168-bd96-4f2e-bfdd-d53d4079e7e7')} style={{...styles.sounDBookBtn}}>
                    <Text style={{...styles.sounDBook}}> ▶  Morality and Civics</Text>
                </TouchableOpacity>
                
            </View>
            <TouchableOpacity style={{...styles.sounDBookBtn,backgroundColor:'rgba(0,0,0,0.5)'}}>
                <Text style={{...styles.sounDBook,color:'white'}}>🧿  Grade 2</Text>
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={()=>settingLink('https://firebasestorage.googleapis.com/v0/b/voice-app-1b659.appspot.com/o/g3%5B1%5D.mp4?alt=media&token=f29a0fce-1561-4aae-87df-4308675f9f10')} style={{...styles.sounDBookBtn}}>
                    <Text style={{...styles.sounDBook}}> ▶  Morality and Civics</Text>
                </TouchableOpacity>
                
            </View>
            <TouchableOpacity style={{...styles.sounDBookBtn,backgroundColor:'rgba(0,0,0,0.5)'}}>
                <Text style={{...styles.sounDBook,color:'white'}}>🧿  Grade 10</Text>
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={()=>settingLink('https://firebasestorage.googleapis.com/v0/b/voice-app-1b659.appspot.com/o/LS101.mp4?alt=media&token=05ab9a79-6a51-486a-9fc4-c43445ab67b8')} style={{...styles.sounDBookBtn}}>
                    <Text style={{...styles.sounDBook}}> ▶  Life Skill</Text>
                </TouchableOpacity>
                
            </View>


           

            
            
            
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    audioContainer:{
        height:"100%",
        width:"100%",
        left:0,
        top:0,
        zIndex:99999,
        borderRadius:5,
        
    },
    onOffButton:{
        fontSize:20,
        textAlign:"center"
    },
    sliderCont:{
        height:"40%",
        backgroundColor:"white",
        marginTop:30,

    },
    onffDiv:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
    },
    AudioBookList:{
        backgroundColor:"grey",
        marginTop:20,
    },
    sounDBook:{
        fontSize:20,
        color:"gray"
    },
    sounDBookBtn:{
        backgroundColor:"white",
        paddingVertical:10,
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderColor:"black",

    }

})

export default AudioBook;