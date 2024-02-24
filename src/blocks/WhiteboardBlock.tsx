import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

export default class WhiteboardBlock extends Block {
  render() {
    return (
      <h1>Whiteboard Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit Whiteboard Block!</h1>
    )
  }

  renderErrorState() {
    return (
      <h1>Sry something went wrong with the whiteboard block</h1>
    )
  }
}