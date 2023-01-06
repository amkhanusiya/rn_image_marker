import {View} from 'react-native';
import {
  GestureEvent,
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import React, {useState} from 'react';
import randomId from './utils/randomId';
import {Rectangle} from './state/Rectangle';
import Annotation from './Annotation';

const PictureAnnotation = props => {
  const {onUpdate} = props;
  const [rectangles, setRectangles] = useState([]);
  const [pendingRectangle, setPendingRectangle] = useState();

  const onStart = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const {x, y} = event.nativeEvent;
    if (!pendingRectangle) {
      const newShapeId = randomId();
      let rectArray = rectangles;
      const rectangle = new Rectangle();
      rectangle.start = {x: y, y: x};
      rectangle.id = newShapeId;
      rectArray.push(rectangle);
      setRectangles(rectArray);
      setPendingRectangle(rectangle);
    }
  };

  const onPress = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const {x, y, translationX, translationY} = event.nativeEvent;

    if (pendingRectangle) {
      let start = pendingRectangle.start;
      let dimensions = pendingRectangle.dimensions;
      if (start.x > y || start.y > x) {
        if (translationX < 0 && translationY < 0) {
          start = {x: y, y: x};
          dimensions = {w: translationX * -1, h: translationY * -1};
        } else {
          if (start.x > y) {
            start = {x: y};
            dimensions = {
              h: translationY * -1,
              w: translationX,
            };
          }
          if (start.y > x) {
            start = {y: x};
            dimensions = {
              w: translationX * -1,
              h: translationY,
            };
          }
        }
      } else {
        if (translationX < 0 || translationY < 0) {
          if (translationX < 0) {
            dimensions = {
              w: translationX * -1,
              h: translationY,
            };
          }
          if (translationY < 0) {
            dimensions = {
              w: translationX,
              h: translationY * -1,
            };
          }
        } else {
          dimensions = {w: translationX, h: translationY};
        }
      }

      pendingRectangle.dimensions = dimensions;
      pendingRectangle.start = start;
    }
  };

  const onEnd = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const {x, y} = event.nativeEvent;
    const width = x - pendingRectangle.start.x;
    const height = y - pendingRectangle.start.y;
    if (rectangles.length > 0 && width > 0 && height > 0) {
      pendingRectangle.end = {x: y, y: x};
      pendingRectangle.dimensions = {w: width, h: height};
      onUpdate(rectangles);
    }
    setPendingRectangle(null);
  };

  const deleteAnnotation = id => {
    console.log('delete =>', id);
    const filteredArray = rectangles.filter(item => item.id !== id);
    setRectangles(filteredArray);
    setPendingRectangle(null);
    console.log('after delete =>', rectangles);
    onUpdate(rectangles);
  };

  const selectedAnnotation = rectangle => {
    setPendingRectangle(rectangle);
  };

  const tagAnnotation = (id, tag) => {
    console.log('tag =>', id, ' tag => ', tag);
    pendingRectangle.tag = tag;
    setPendingRectangle(null);
    onUpdate(rectangles);
  };

  return (
    <View
      style={{
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <PanGestureHandler
          onBegan={onStart}
          onGestureEvent={onPress}
          onEnded={onEnd}>
          <View style={{flex: 1}}>
            {rectangles.map(item => (
              <Annotation
                rectangle={item}
                key={item.id}
                onDelete={deleteAnnotation}
                onTagged={tagAnnotation}
                onSelected={selectedAnnotation}
              />
            ))}
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
};

export default PictureAnnotation;
