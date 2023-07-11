import React, { Component } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Modal,
  ActivityIndicator,
  Image,
  ToastAndroid,
  Alert,
  
} from 'react-native'

// import Toast from '@remobile/react-native-toast'
import BluetoothSerial from 'react-native-bluetooth-serial'
import { Buffer } from 'buffer'
global.Buffer = Buffer
const iconv = require('iconv-lite')

const Button = ({ title, onPress, style, textStyle }) =>
  <TouchableOpacity style={[ styles.button, style ]} onPress={onPress}>
    <Text style={[ styles.buttonText, textStyle ]}>{title.toUpperCase()}</Text>
  </TouchableOpacity>


const DeviceList = ({ devices, connectedId, showConnectedIcon, onDevicePress }) =>
  <ScrollView style={styles.container}>
    <View style={styles.listContainer}>
      {devices.map((device, i) => {
        return (
          <TouchableHighlight
            underlayColor='#DDDDDD'
            key={`${device.id}_${i}`}
            style={styles.listItem} onPress={() => onDevicePress(device)}>
            <View style={{ flexDirection: 'row' }}>
              {showConnectedIcon
              ? (
                <View style={{ width: 48, height: 48, opacity: 0.4 }}>
                  {connectedId === device.id
                  ? (
                    <Text>✔</Text>
                  ) : null}
                </View>
              ) : null}
              <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{device.name}</Text>
                <Text style={{ fontWeight: 'bold',color:'black' }}>{`<${device.id}>`}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )
      })}
    </View>
  </ScrollView>





class BluetoothConnection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
      section: 0,
      comvalue:''
    }
  }

  

  componentDidMount () {
    // const { comand } = this.props;
    // Alert.alert(comand)
    
  
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled, devices ] = values
      this.setState({ isEnabled, devices })
    })

    BluetoothSerial.on('bluetoothEnabled', () =>  ToastAndroid.show('Bluetooth Enabled', ToastAndroid.SHORT))
    BluetoothSerial.on('bluetoothDisabled', () => ToastAndroid.show('Bluetooth disabled', ToastAndroid.SHORT))
    BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
    BluetoothSerial.on('connectionLost', () => {
      if (this.state.device) {
        ToastAndroid.show(`Connection to device ${this.state.device.name} has been lost`, ToastAndroid.SHORT)
      }
      this.setState({ connected: false })
    })
  }

  /**
   * [android]
   * request enable of bluetooth from user
   */
  requestEnable () {
    BluetoothSerial.requestEnable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
  }

  /**
   * [android]
   * enable bluetooth on device
   */
  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
  }

  /**
   * [android]
   * disable bluetooth on device
   */
  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
  }

  /**
   * [android]
   * toggle bluetooth
   */
  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }

  /**
   * [android]
   * Discover unpaired devices, works only in android
   */
  discoverUnpaired () {
    if (this.state.discovering) {
      return false
    } else {
      this.setState({ discovering: true })
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        this.setState({ unpairedDevices, discovering: false })
      })
      .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
    }
  }

  /**
   * [android]
   * Discover unpaired devices, works only in android
   */
  cancelDiscovery () {
    if (this.state.discovering) {
      BluetoothSerial.cancelDiscovery()
      .then(() => {
        this.setState({ discovering: false })
      })
      .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
    }
  }

  /**
   * [android]
   * Pair device
   */
  pairDevice (device) {
    BluetoothSerial.pairDevice(device.id)
    .then((paired) => {
      if (paired) {
        ToastAndroid.show(`Device ${device.name} paired successfully`, ToastAndroid.SHORT)
        const devices = this.state.devices
        devices.push(device)
        this.setState({ devices, unpairedDevices: this.state.unpairedDevices.filter((d) => d.id !== device.id) })
      } else {
        ToastAndroid.show(`Device ${device.name} pairing failed`, ToastAndroid.SHORT)
      }
    })
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
  }

  /**
   * Connect to bluetooth device by id
   * @param  {Object} device
   */
  connect (device) {
    this.setState({ connecting: true })
    BluetoothSerial.connect(device.id)
    .then((res) => {
      ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT)
  
      this.setState({ device, connected: true, connecting: false })
    })
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
  }

  /**
   * Disconnect from bluetooth device
   */
  disconnect () {
    BluetoothSerial.disconnect()
    .then(() => this.setState({ connected: false }))
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
  }

  /**
   * Toggle connection when we have active device
   * @param  {Boolean} value
   */
  toggleConnect (value) {
    if (value === true && this.state.device) {
      this.connect(this.state.device)
    } else {
      this.disconnect()
    }
  }

  /**
   * Write message to device
   * @param  {String} message
   */

  write (message='D') {
    if (!this.state.connected) {
      ToastAndroid.show('You must connect to device first', ToastAndroid.SHORT)
    }
  
    BluetoothSerial.write(message)
    .then((res) => {
      ToastAndroid.show('Successfuly wrote to device', ToastAndroid.SHORT)
      this.setState({ connected: true })
    })
    .catch((err) => ToastAndroid.show(err.message, ToastAndroid.SHORT))
  }

  

  componentDidUpdate(prevProps) {
    // Check if specific condition is met
    console.log(this.props.comand);
    if (this.props.comand !== prevProps?.comand) {
      // Call the function when the condition is met
    
      this.write(this.props.comand);
      // console.log("New: "+this.props.comand +" Prev: "+prevProps?.comand);
    }
  }



  onDevicePress (device) {
    if (this.state.section === 0) {
      this.connect(device)
    } else {
      this.pairDevice(device)
    }
  }

  writePackets (message, packetSize = 64) {
    const toWrite = iconv.encode(message, 'cp852')
    const writePromises = []
    const packetCount = Math.ceil(toWrite.length / packetSize)

    for (var i = 0; i < packetCount; i++) {
      const packet = new Buffer(packetSize)
      packet.fill(' ')
      toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize)
      writePromises.push(BluetoothSerial.write(packet))
    }

    Promise.all(writePromises)
    .then((result) => {
    })
  }


  

  render () {
  
    const {state, dispatch,comand} = this.props;
    const runCom = ()=>{
      this.write(comand)
    }
  
    const activeTabStyle = { borderBottomWidth: 6, borderColor: '#009688' }
    return (
      <ScrollView>
        <View style={styles.topBar}>
          <Text style={styles.heading}>Bluetooth Serial</Text>
        
          {Platform.OS === 'android'
          ? (
            <View style={styles.enableInfoWrapper}>
              <Text style={{ fontSize: 12, color: '#FFFFFF' }}>
                {this.state.isEnabled ? 'disable' : 'enable'}
              </Text>
              <Switch
                onValueChange={this.toggleBluetooth.bind(this)}
                value={this.state.isEnabled} />
            </View>
          ) : null}
        </View>

        

        {Platform.OS === 'android'
        ? (
          <View style={[styles.topBar, { justifyContent: 'center', paddingHorizontal: 0 }]}>
            <TouchableOpacity style={[styles.tab, this.state.section === 0 && activeTabStyle]} onPress={() => this.setState({ section: 0 })}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>PAIRED DEVICES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, this.state.section === 1 && activeTabStyle]} onPress={() => this.setState({ section: 1 })}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>UNPAIRED DEVICES</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.discovering && this.state.section === 1
        ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator
              style={{ marginBottom: 15 }}
              size={60} />
            <Button
              textStyle={{ color: '#FFFFFF' }}
              style={styles.buttonRaised}
              title='Cancel Discovery'
              onPress={() => this.cancelDiscovery()} />
          </View>
        ) : (
          <DeviceList
            showConnectedIcon={this.state.section === 0}
            connectedId={this.state.device && this.state.device.id}
            devices={this.state.section === 0 ? this.state.devices : this.state.unpairedDevices}
            onDevicePress={(device) => this.onDevicePress(device)} />
        )}

{/* 
        <SendButon writetxt={()=>this.write('D')}/> */}
        {this.state.connected&&<View>
          <TouchableOpacity style={{backgroundColor:'black',padding:10}} onPress={()=>this.write('D')}>
          <Text style={{textAlign:'center', color:'white'}}>Hands Down</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'black',padding:10}} onPress={()=>this.write('C')}>
          <Text style={{textAlign:'center', color:'white'}}>Hands Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:'black',padding:10}} onPress={()=>this.write('F')}>
          <Text style={{textAlign:'center', color:'white'}}>Head</Text>
          </TouchableOpacity>
         
         
        </View>}
       
      


        <View style={{ alignSelf: 'flex-end', height: 52 }}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.fixedFooter}>
            {Platform.OS === 'android' && this.state.section === 1
            ? (
              <Button
                title={this.state.discovering ? '... Discovering' : 'Discover devices'}
                onPress={this.discoverUnpaired.bind(this)} />
            ) : null}
            {Platform.OS === 'android' && !this.state.isEnabled
            ? (
              <Button
                title='Request enable'
                onPress={() => this.requestEnable()} />
            ) : null}
          </ScrollView>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: '#F5FCFF'
  },
  topBar: { 
    height: 56, 
    paddingHorizontal: 16,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' ,
    elevation: 6,
    backgroundColor: '#7B1FA2'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    color: '#FFFFFF'
  },
  enableInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tab: { 
    alignItems: 'center', 
    flex: 0.5, 
    height: 56, 
    justifyContent: 'center', 
    borderBottomWidth: 6, 
    borderColor: 'transparent' 
  },
  connectionInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  connectionInfo: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
    marginVertical: 10,
    color: '#238923'
  },
  listContainer: {
    borderColor: '#ccc',
    borderTopWidth: 0.5
  },
  listItem: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderColor: '#ccc',
    borderBottomWidth: 0.5,
    justifyContent: 'center'
  },
  fixedFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  button: {
    height: 36,
    margin: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#7B1FA2',
    fontWeight: 'bold',
    fontSize: 14
  },
  buttonRaised: {
    backgroundColor: '#7B1FA2',
    borderRadius: 2,
    elevation: 2
  }
})

export default BluetoothConnection






// import React, { useState,useEffect } from 'react';
// import { View, Text, Button, ScrollView,StyleSheet,TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
// import BluetoothSerial from 'react-native-bluetooth-serial';
// import DeviceList from './DeviceList';
// import { PermissionsAndroid, Platform } from 'react-native';



// const BluetoothConnection = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [SelectedId, setSelectedId] = useState('');
//   const [allDevice, setallDevice] = useState(null);
//   const [isBlueToothOn, setisBlueToothOn] = useState(null);
//   const [isLoading, setisLoading] = useState(false);
//   const [datasend, setdatasend] = useState('123');
 

//   const requestBluetoothPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//         {
//           title: 'Bluetooth Permission',
//           message: 'This app needs access to your Bluetooth location to discover and connect to Bluetooth devices.',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Bluetooth permission granted');
//         return true;
//       } else {
//         console.log('Bluetooth permission denied');
//         return false;
//       }
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   };
  
//   const getPermissionsFromUser = async () => {
//     if (Platform.OS === 'android') {
//       const hasBluetoothPermission = requestBluetoothPermission();
//       hasBluetoothPermission?.then((result)=>{
//         if (result) {
//           setisBlueToothOn(true)
//           // Continue with Bluetooth operations
//           connect()
//           return true;
//         } else {
//           // Handle the case when Bluetooth permission is denied
//           return false;
//         }
//       })
      
//     } else {
//       // Handle other platforms (iOS, etc.) if needed
//       console.log('Platform not supported');
//       return false;
//     }
//   };

 

//   // const sendData = ()=>{
//   //   BluetoothSerial.write("hands up")
//   //   .then((res) => console.log(res))
//   //   .catch((err) => console.log(err));
//   // }

//   const sendData = () => {
//     BluetoothSerial.write('hands down')
//       .then((bytesWritten) => {
//         if (bytesWritten > 0) {
//           console.log('Data sent successfully');
//           // Handle successful data transmission
//         } else {
//           console.log('Data not sent');
//           // Handle case when data transmission failed
//         }
//       })
//       .catch((error) => {
//         console.log('Error sending data:', error);
//         // Handle error during data transmission
//       });
//   };
  

//   const getBId = (id,name)=>{
//     setisLoading(true)
//     BluetoothSerial.connect(id)
//     .then(() => {
//       alert("Connected- "+ name);
      
//       // Perform actions after successful connection
//       setIsConnected(true);
//       setSelectedId(name)
//       setisLoading(false)
//       console.log('Connected to device:'+name);
      
//     })
//     .catch((error) => {
//       // console.error('Connection error:');
//       // Handle connection error
//       setisLoading(false)
      
//       alert("Failed to Connect- "+ name);
//     })
    
    
    
      
    
    
    
//   }

//   let content=[];
//   const connect = async () => {
//     setisLoading(true)
//     try {
//       // Get a list of available Bluetooth devices
//       const devices = await BluetoothSerial.list();
//       // Connect to the first available device
//       const device = devices[0];
      
      
      
//       devices.forEach((element,index) => {
//         content.push(<DeviceList key={index} name={element?.name} id={element?.id} setid={getBId}/>)
//       });
//       console.log(content);

//       setallDevice(content)
//       setisLoading(false)
      
      
//     } catch (err) {
//       setisLoading(false)
//       alert("Faild To Connect");
//       console.log("Connection Error: "+err);
//     }
//   };

//   const disconnect = async () => {
//     setisLoading(true)
//     try {
//       await BluetoothSerial.disconnect();
//       setIsConnected(false);
//       setisLoading(false)
//     } catch (err){
//       setisLoading(false)
//       console.log("Disconnection Error: "+err);
//     }
//   };

 

//   // useEffect(() => {
   
//   //   console.log(allDevice);
//   // }, [content]);
//   if(isLoading) return <ActivityIndicator size={25} color={'black'} />
//   return (
//     <View>
//       {isConnected ? (
//         <Button title={"Disconnect ("+SelectedId+")"} onPress={disconnect} />
//       ) : (
//         <Button title="My Paired Devices" onPress={getPermissionsFromUser} />
//       )}
//       {
//         allDevice&&(
//           <ScrollView style={styles.showAllPairdD}>
              
//               {allDevice?.map((element)=> element)}
//               {allDevice?.length===0&&<Text style={{color:'gray'}}>Please Enable Bluetooth and Pair the Device first.</Text>}
//               {isBlueToothOn&&<Text style={{color:'gray'}}>Bluetooth Permission Ok</Text>}
//               {allDevice?.length===0&&<Text style={{color:'gray'}}>No Device found</Text>}
            
            
//           </ScrollView>
//         )
//       }
//       <View style={{marginTop:30}}></View>
//       {
//         isConnected&&<View style={{padding:10}}>
//           <TextInput onChangeText={(v)=>setdatasend(v)} style={{borderColor:'gray', borderWidth:1, marginBottom:5}} />
//           <Button title='Send Data' onPress={sendData}></Button>
//         </View>
//       }
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   showAllPairdD:{
//     height:200,
//     backgroundColor:'rgba(0,0,0,0.1)',
//     margin:10,
//     borderRadius:4,
//     padding:15,
//     paddingBottom:0,
//     marginBottom:0,
//     paddingTop:0,
//     paddingBottom:0
//   },
  
// })

// export default BluetoothConnection;







