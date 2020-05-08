import React, { useEffect } from 'react'
import { StyleSheet, View, Animated, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import ItemViewTitle from './ItemViewTitle'
import ItemViewSubtitle from './ItemViewSubtitle'
import ItemViewImage from './ItemViewImage'
import { IItemView, IAnimation } from './types'

const width = Dimensions.get('window').width

interface IProps extends IItemView {
  animation: IAnimation
  contentAlignment: 'left' | 'center'
}

const ItemView = (props: IProps) => {
  const animated = new Animated.Value(props.animation.name !== 'none' ? 0 : 1)

  useEffect(() => {
    if (props.animation.name !== 'none') {
      Animated.timing(animated, {
        toValue: 1,
        duration: props.animation.duration,
        delay: props.animation.delay,
        useNativeDriver: true,
      }).start()
    }
  }, [])

  let transform: number | Animated.AnimatedInterpolation = 0
  let outputRange: number | number[]
  let isXTransform = false

  switch (props.animation.name) {
    case 'slide-up':
      outputRange = [30, 0]
      break
    case 'slide-down':
      outputRange = [-30, 0]
      break
    case 'slide-right':
      outputRange = [-width, 0]
      isXTransform = true
      break
    case 'slide-left':
        outputRange = [width, 0]
        isXTransform = true
        break
    default:
      outputRange = 0
  }

  if (outputRange !== 0) {
    transform = animated.interpolate({
      inputRange: [0, 1],
      outputRange: outputRange as number[],
    })
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          flexDirection: props.contentAlignment === 'center' ? 'column' : 'row',
          opacity: animated,
          transform: [
            isXTransform ? {
              translateX: transform,
            } : {
              translateY: transform,
            },
          ],
        },
      ]}
    >
      <ItemViewImage
        {...props.image}
      />
      <View style={styles.textContainer}>
        <ItemViewTitle
          { ...props.title }
          contentAlignment={props.contentAlignment}
        />
        <ItemViewSubtitle
        { ...props.subtitle }
          contentAlignment={props.contentAlignment}
        />
      </View>
    </Animated.View>
  )
}

export default ItemView

ItemView.propTypes = {
  title: PropTypes.shape({
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
    weight: PropTypes.string,
  }),
  subtitle: PropTypes.shape({
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
    weight: PropTypes.string,
  }),
  image: PropTypes.shape({
    component: PropTypes.node.isRequired,
    size: PropTypes.number,
  }),
  animation: PropTypes.shape({
    name: PropTypes.string,
    duration: PropTypes.number,
    delay: PropTypes.number,
  }),
  contentAlignment: PropTypes.oneOf(['left', 'center']),
}

ItemView.defaultProps = {
  contentAlignment: 'left',
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  textContainer: {
    flex: 1,
  },
  image: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
