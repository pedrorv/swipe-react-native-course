import React, { Component } from 'react'
import { 
  View, 
  Animated,
  PanResponder,
  Dimensions
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3
const SWIPE_OUT_DURATION = 300

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  }

  constructor(props) {
    super(props)

    const position = new Animated.ValueXY()
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left')
        } else {
          this.resetPosition()
        }        
      }
    })

    this.state = { panResponder, position, index: 0 }
  }

  forceSwipe(direction) {
    const xSwipe = (direction === 'right') ? SCREEN_WIDTH : -SCREEN_WIDTH

    Animated.timing(this.state.position, {
      toValue: { x: xSwipe, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction))
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props
    const item = data[this.state.index]

    (direction === 'right') ? onSwipeRight(item) : onSwipeLeft(item)
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start()
  }

  getCardStyle() {
    const { position } = this.state
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-60deg', '0deg', '60deg']
    })

    return {
      ...position.getLayout(),
      transform: [
        { rotate }
      ]
    }
  }

  renderCards() {
    return this.props.data.map((card, index) => {
      if (index === 0) {
        return (
          <Animated.View 
            style={this.getCardStyle()}
            {...this.state.panResponder.panHandlers}
            key={card.id}
          >
            {this.props.renderCard(card)}
          </Animated.View>
        )
      }

      return this.props.renderCard(card)
    })
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
      
    )
  }
}

export default Deck