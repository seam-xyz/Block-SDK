import Block from './Block';
import { BlockModel } from './types';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import TextEditor from './TextEditor/TextEditor';
import './TextEditor/TextEditorStyles.css';
import BlockFactory from './BlockFactory';
import { linkDecorator } from "./TextEditor/Link";

export default class TextEditBlock extends Block {
  blockStyleFn = (block: any) => {
    let alignment = 'left';
    block.findStyleRanges((e: any) => {
      if (e.hasStyle('center')) {
        alignment = 'center';
      }
      if (e.hasStyle('right')) {
        alignment = 'right';
      }
    });
    return `editor-alignment-${alignment}`;
  };

  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    let textState = this.model.data["textState"];
    if (textState === undefined) {
      return this.renderErrorState();
    }

    const onEditorStateChange = (editorState: EditorState) => {};

    return (
      <Editor
        editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(textState)), linkDecorator)}
        onChange={onEditorStateChange}
        blockStyleFn={this.blockStyleFn}
        readOnly={true}
      />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    let textState = this.model.data["textState"];
    return (
      <div className="text-center flex items-start justify-center h-full w-full" id={this.model.uuid}>
        <TextEditor
          data={textState}
          done={(data: string): void => {
            this.model.data["textState"] = data;
            done(this.model);
          }}
        />
      </div>
    );
  }

  renderErrorState() {
    return <h1>Error: Couldn't figure out the text</h1>;
  }
}