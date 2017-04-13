import React, { Component } from 'react'
import { 
  View, 
  Animated,
  PanResponder,
  Dimensions
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

class Deck extends Component {
  constructor(props) {
    super(props)

    const position = new Animated.ValueXY()
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: () => {

      }
    })

    this.state = { panResponder, position }
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