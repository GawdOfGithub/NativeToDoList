import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState,useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View,Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import EmojiList from './components/EmojiList';
import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import { Button as But } from '@rneui/base';
const PlaceholderImage = require('./assets/images/background-image.png');
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiSticker from './components/EmojiSticker';
import * as MediaLibrary from 'expo-media-library'
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image'
export default function App() {
  <StatusBar style="light" />

  const [status,requestPermission] = MediaLibrary.usePermissions()
  if(status ===null){
    requestPermission()
  }
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions,setShowAppOptions] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const imageRef = useRef()
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
console.log(result);
    if (!result.canceled) {
      console.log(selectedImage);
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true)
    } else {
      alert("You did not select any image.");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true)
  };

  const onSaveImageAsync = async () => {
    if(Platform.OS !=='web') {
       try {
      const localUri = await captureRef(imageRef,{
        height:440,
        quality:1
      })
      await MediaLibrary.saveToLibraryAsync(localUri)
      if(localUri){
        alert("Saved")
      }
      
    } catch (error) {
      console.log(e);
    }
  }
else{
  try {
    const dataUrl = await domtoimage.toJpeg(imageRef.current,{
      quality:1,
      width:320,
      height:440
    })
    let link = document.createElement('a')
    link.download = 'sticker-smash.jpeg'
    link.href=dataUrl
    link.click()
    
  } catch (error) {
    console.log(error);
    
  }
}

    }
    
   
  const onModalClose = ()=>
  {
  setIsModalVisible(false)
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
      <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <View style={styles.imageContainer}>
         <View ref={imageRef} collapsable={false}>

        
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
      </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style ={styles.optionsRow}>
          <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />            
             </View>
           </View>
      ):
        
        
        
        <View style={styles.footerContainer}>

<Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
{/* <Button label="Use this photo" onPress={() => setShowAppOptions(true)} /> */}
<But
              title="Use this photo"
              icon={{
                name: 'save',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconContainerStyle={{ marginRight: 10 }}
              titleStyle={{ fontWeight: '700' }}
              buttonStyle={{
                backgroundColor: 'rgba(90, 154, 230, 1)',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              onPress={() => setShowAppOptions(true)}
            />
</View>
        }
    
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex:1, 
    paddingTop: 58
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
