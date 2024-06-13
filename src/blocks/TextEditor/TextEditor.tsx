// Thanks to https://codesandbox.io/s/44ln1
import React, { useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, DraftHandleValue, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button } from '@mui/material';
import '../BlockStyles.css'
import { List, AlignLeft, AlignCenter, AlignRight, Code, Link, PlusCircle } from 'react-feather'
import { ReactComponent as NumberedList } from "./images/NumberedList.svg"
import { linkDecorator } from "./Link";
import SeamSaveButton from '../../components/SeamSaveButton';

interface TextEditorProps {
  data: string | null;
  done: (data: string) => void;
}

interface EditorButtonProps {
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active: boolean;
  label: any;
  styleType: 'header' | 'style' | 'list' | 'alignment';
}

const EditorButton: React.FC<EditorButtonProps & { disabled?: boolean }> = ({ onMouseDown, active, label, styleType, disabled = false }) => {
  const isActiveListOrAlignment = styleType === 'list' || styleType === 'alignment';
  const buttonClass = `p-1 rounded-full font-bold border ${active ? "bg-seam-pink text-white" : "text-seam-black"} ${disabled ? "bg-gray-200/10 text-gray-500 border-gray-500 cursor-not-allowed" : "bg-[#EFEFEF]"}`;

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(e);
      }}
      className={buttonClass}
      style={{ width: '24px', height: '24px', padding: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      disabled={disabled}
    >
      {isActiveListOrAlignment ? React.cloneElement(label, { color: active ? "white" : (disabled ? "gray" : "black") }) : label}
    </button>
  );
};

interface ButtonContainerProps {
  children: React.ReactNode;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ children }) => {
  return (
    <div className="rounded-full bg-[#FCFCFC] p-4 border-2 border-[#EFEFEF] space-x-2 flex">
      {children}
    </div>
  );
};

const TextEditor: React.FC<TextEditorProps> = ({ data, done }) => {
  const initialState = data
  ? EditorState.createWithContent(convertFromRaw(JSON.parse(data)), linkDecorator)
  : EditorState.createEmpty(linkDecorator);
  const [editorState, setEditorState] = React.useState<EditorState>(initialState);
  const [activeAlignment, setActiveAlignment] = React.useState<string>('left');
  const editorRef = React.useRef<any>(null);
  const [buttonTop, setButtonTop] = useState(0);

  useEffect(() => {
    updateButtonPosition();
  }, [editorState]);

  const updateButtonPosition = () => {
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const node = editorRef.current?.editor.querySelector(`[data-offset-key="${blockKey}-0-0"]`);

    if (node) {
      const nodeRect = node.getBoundingClientRect();
      const rootRect = editorRef.current.editor.getBoundingClientRect();
      // Calculate vertical center of the block and adjust for the height of the button
      const buttonHeight = 16; 
      const headerHeightAdjust = 85;
      const verticalCenter = nodeRect.top - rootRect.top + (nodeRect.height / 2) - (buttonHeight / 2) + headerHeightAdjust;
      setButtonTop(verticalCenter);
    }
  };

  const handleAddBlock = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) return;
    const currentContent = editorState.getCurrentContent();
    const newBlock = Modifier.splitBlock(currentContent, selection);
    const newEditorState = EditorState.push(editorState, newBlock, 'split-block');
    setEditorState(EditorState.forceSelection(newEditorState, newBlock.getSelectionAfter()));
    updateButtonPosition();
  };
  
  const isActiveStyle = (style: string): boolean => editorState.getCurrentInlineStyle().has(style);
  const getBlockType = (): string => editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType();

  const handleKeyCommand = (command: string, state: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => () => setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  const toggleBlockType = (type: string) => () => setEditorState(RichUtils.toggleBlockType(editorState, type));

  // thanks to https://medium.com/@ibraheems.ali95/text-alignment-in-draftjs-and-using-with-statetohtml-caecd0138251
  const alignmentStyles = ['left', 'right', 'center'];
  const applyAlignment = (newStyle: string) => {
    let styleForRemove = alignmentStyles.filter(style => style !== newStyle);
    let currentContent = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let focusBlock = currentContent.getBlockForKey(selection.getFocusKey());
    let anchorBlock = currentContent.getBlockForKey(selection.getAnchorKey());
    let isBackward = selection.getIsBackward();

    let selectionMerge = {
      anchorOffset: 0,
      focusOffset: focusBlock.getLength(),
    };

    if (isBackward) {
      selectionMerge.anchorOffset = anchorBlock.getLength();
    }
    let finalSelection = selection.merge(selectionMerge);
    let finalContent = styleForRemove.reduce((content, style) => Modifier.removeInlineStyle(content, finalSelection, style), currentContent);
    let modifiedContent = Modifier.applyInlineStyle(finalContent, finalSelection, newStyle);
    const nextEditorState = EditorState.push(editorState, modifiedContent, 'change-inline-style');
    setEditorState(nextEditorState);
    setActiveAlignment(newStyle);
  };

  const handleAddLink = () => {
    // Thanks to https://github.com/facebook/draft-js/blob/main/examples/draft-0-10-0/link/link.html
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

    let url = '';
    if (linkKey) {
      const linkInstance = contentState.getEntity(linkKey);
      url = linkInstance.getData().url;
    }
    let link = prompt("Please enter the URL of your link", url);
    if (!link) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
      return;
    }
    link = (link.indexOf(':') === -1) ? 'http://' + link : link;
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link
    });
    const newEditorState = EditorState.push(editorState, contentWithEntity, "apply-entity");
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
  };

  const blockStyleFn = (block: any) => {
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


  // can add more text formatting options here in the future
  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: 'line-through',
    },
  };

  const saveContent = () => done(JSON.stringify(convertToRaw(editorState.getCurrentContent())));

  return (
    <div className="w-full flex flex-col items-start justify-start">
      <div className="relative min-h-[300px] w-full z-10">
        <div className="grow" onClick={() => editorRef.current.focus()}>
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            blockStyleFn={blockStyleFn}
            autoCapitalize="sentences"
          />
        </div>
      </div>
      <button
        style={{ top: `${buttonTop}px`, position: 'absolute', left: '24px', zIndex: 50 }} // Ensure it is visually on top
        className="transform -translate-x-full opacity-50 hover:opacity-100"
        onClick={handleAddBlock}
      >
        <PlusCircle size={16} className="text-seam-black" />
      </button>
      <div className="sticky bottom-0 w-full">
        <div className="flex flex-row overflow-x-scroll hide-scrollbar space-x-2 mt-2">
          <ButtonContainer>
            <EditorButton onMouseDown={toggleBlockType('unstyled')} active={getBlockType() === 'unstyled'} label="P" styleType="header" />
            <EditorButton onMouseDown={toggleBlockType('header-one')} active={getBlockType() === 'header-one'} label="H1" styleType="header" />
            <EditorButton onMouseDown={toggleBlockType('header-two')} active={getBlockType() === 'header-two'} label="H2" styleType="header" />
            <EditorButton onMouseDown={toggleBlockType('header-three')} active={getBlockType() === 'header-three'} label="H3" styleType="header" />
            <EditorButton 
              onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddLink();
              }} 
              active={false} 
              label={<Link size={24} color={editorState.getSelection().isCollapsed() ? "gray" : "black"} className={editorState.getSelection().isCollapsed() ? "opacity-10" : ""} />} 
              styleType="style" 
              disabled={editorState.getSelection().isCollapsed()} // disable link button when no text selected
            />
          </ButtonContainer>
          <ButtonContainer>
            <EditorButton onMouseDown={toggleInlineStyle('BOLD')} active={isActiveStyle('BOLD')} label="B" styleType="style" />
            <EditorButton onMouseDown={toggleInlineStyle('ITALIC')} active={isActiveStyle('ITALIC')} label={<div className="italic">I</div>} styleType="style" />
            <EditorButton onMouseDown={toggleInlineStyle('UNDERLINE')} active={isActiveStyle('UNDERLINE')} label={<div className="underline">U</div>} styleType="style" />
            <EditorButton onMouseDown={toggleInlineStyle('STRIKETHROUGH')} active={isActiveStyle('STRIKETHROUGH')} label={<div className="line-through">S</div>} styleType="style" />
          </ButtonContainer>
          <ButtonContainer>
            <EditorButton onMouseDown={toggleBlockType('unordered-list-item')} active={getBlockType() === 'unordered-list-item'} label={<List size={24} color="black" />} styleType="list" />
            <EditorButton onMouseDown={toggleBlockType('ordered-list-item')} active={getBlockType() === 'ordered-list-item'} label={<NumberedList className="h-[16px] w-[19px]" />} styleType="list" />
            <EditorButton onMouseDown={toggleBlockType('code-block')} active={getBlockType() === 'code-block'} label={<Code size={24} color="black" />} styleType="list" />
          </ButtonContainer>
          <ButtonContainer>
            <EditorButton onMouseDown={(e) => applyAlignment('left')} active={activeAlignment === 'left'} label={<AlignLeft size={24} />} styleType="alignment" />
            <EditorButton onMouseDown={(e) => applyAlignment('center')} active={activeAlignment === 'center'} label={<AlignCenter size={24} color="black" />} styleType="alignment" />
            <EditorButton onMouseDown={(e) => applyAlignment('right')} active={activeAlignment === 'right'} label={<AlignRight size={24} color="black" />} styleType="alignment" />
          </ButtonContainer>
        </div>
        <SeamSaveButton onClick={saveContent} />
      </div>
    </div>
  );
};

export default TextEditor;