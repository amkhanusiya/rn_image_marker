import React, {useCallback, useEffect, useState} from 'react';
import {Button, Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import PictureAnnotation from './PictureAnnotation';
import {
  getDBConnection,
  saveImage,
  createTable,
  getAllImages,
} from './db/db-service';
import RNFS from 'react-native-fs';
import {request, PERMISSIONS} from 'react-native-permissions';

const App: () => Node = () => {
  const [pickerResponse, setPickerResponse] = useState(null);
  const [rectangles, setRectangles] = useState([]);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback().then(r => console.log('db operation done'));
  }, [loadDataCallback]);

  const updateRectangles = rectangles => {
    console.log('update called');
    setRectangles(rectangles);
  };

  const _openGallery = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    await launchImageLibrary(options, setPickerResponse);
  };

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;

  const _undoPressed = () => {
    alert('in development');
  };

  const _savePressed = async () => {
    // console.log(pickerResponse.assets[0]);
    const db = await getDBConnection();
    await saveImage(
      db,
      pickerResponse.assets[0].fileName,
      rectangles,
      pickerResponse.assets[0].uri,
    );
  };
  const _exportPressed = async () => {
    const db = await getDBConnection();
    const allImages = await getAllImages(db);
    if (allImages.length === 0) {
      alert('No data found to export');
      return;
    }
    const granted = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    console.log(granted);
    if (granted) {
      const path = RNFS.DownloadDirectoryPath + `/exported_${Date.now()}.json`;
      await RNFS.writeFile(path, JSON.stringify(allImages), 'utf8');
      alert(`File exported to ${path}`);
    }
  };

  const _loadSavedImages = () => {
    alert('in development');
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <View style={styles.rowViewStyle}>
        <Button title="Pick from Gallery" onPress={_openGallery} />
        <Button title="Load Saved Images" onPress={_loadSavedImages} />
        <Button title="Export" onPress={_exportPressed} />
      </View>
      {uri && (
        <View style={{flex: 1}}>
          <Image source={{uri}} style={styles.imageStyle}></Image>
          <PictureAnnotation onUpdate={updateRectangles} />
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <View style={styles.buttonStyle}>
              <Button title="Undo" onPress={_undoPressed} />
            </View>
            <View style={styles.buttonStyle}>
              <Button title="Save" onPress={_savePressed} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  imageStyle: {
    resizeMode: 'contain',
    flex: 1,
    aspectRatio: 1,
    margin: 20,
  },
  rowViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default App;
