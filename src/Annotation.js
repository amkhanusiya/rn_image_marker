import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {TapGestureHandler, State} from 'react-native-gesture-handler';

const Annotation = props => {
  const {rectangle, onDelete, onTagged, onSelected} = props;
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [tag, setTag] = useState(rectangle.tag);

  const _onSingleTap = event => {
    if (event.nativeEvent.state === State.BEGAN) {
      onSelected(rectangle);
      setTagModalVisible(true);
    }
  };

  const _tagModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={tagModalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{color: 'black'}}>Set Tag</Text>
              <TextInput
                style={styles.input}
                onChangeText={setTag}
                value={tag}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  width: '100%',
                }}>
                <Pressable
                  style={[styles.button, styles.buttonDelete]}
                  onPress={() => {
                    setTag('');
                    setTagModalVisible(false);
                    onDelete(rectangle.id);
                  }}>
                  <Text>Delete</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonSubmit]}
                  onPress={() => {
                    setTag(tag);
                    setTagModalVisible(false);
                    onTagged(rectangle.id, tag);
                  }}>
                  <Text>Submit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View>
      <TapGestureHandler onHandlerStateChange={_onSingleTap} maxDist={200}>
        <View
          style={{
            position: 'absolute',
            borderColor: '#fff',
            borderWidth: 2,
            top: rectangle.start?.x ?? rectangle.end?.x,
            left: rectangle.start?.y ?? rectangle.end?.y,
            width: rectangle.dimensions?.w ?? 0,
            height: rectangle.dimensions?.h ?? 0,
            alignItems: 'baseline',
          }}>
          {tag && (
            <Text
              style={{
                backgroundColor: 'white',
                color: 'green',
              }}>
              {tag}
            </Text>
          )}
        </View>
      </TapGestureHandler>
      {_tagModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    color: 'black',
    marginTop: 10,
    placeholderTextColor: 'black',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    elevation: 0,
  },
  buttonDelete: {
    backgroundColor: '#F194FF',
  },
  buttonSubmit: {
    backgroundColor: '#2196F3',
    marginStart: 10,
  },
});

export default Annotation;
