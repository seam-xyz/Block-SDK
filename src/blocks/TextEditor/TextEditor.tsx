// Thanks to https://codesandbox.io/s/44ln1
import React, { useState, useEffect, useRef } from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, DraftHandleValue, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Box } from '@mui/material';
import '../BlockStyles.css';
import { List, AlignLeft, AlignCenter, AlignRight, Code, Link, X } from 'react-feather';
import { ReactComponent as NumberedList } from "./images/NumberedList.svg";
import { linkDecorator } from "./Link";
import SeamSaveButton from '../../components/SeamSaveButton';
import { TwitterPicker } from 'react-color';

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
  const [editorState, setEditorState] = useState<EditorState>(initialState);
  const [activeAlignment, setActiveAlignment] = useState<string>('left');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('black');
  const editorRef = useRef<any>(null);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
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

  const applyColor = (color: string) => {
    const selection = editorState.getSelection();
    const nextContentState = Modifier.applyInlineStyle(editorState.getCurrentContent(), selection, color);
    setEditorState(EditorState.push(editorState, nextContentState, 'change-inline-style'));
  };

  const generateColorStyles = () => {
    const colors = [
      'ff6900', 'fcb900', '7bdcb5', '00d084', '8ed1fc', '0693e3', 'abb8c3',
      'eb144c', 'f78da7', '9900ef', '000000', 'FFFFFF'
    ];
    return colors.reduce((styles, color) => {
      styles[`COLOR_${color.toUpperCase()}`] = { color: `#${color}` };
      return styles;
    }, {} as any);
  };

  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: 'line-through',
    },
    ...generateColorStyles(),
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

  const saveContent = () => done(JSON.stringify(convertToRaw(editorState.getCurrentContent())));

  return (
    <div className="w-full flex grow flex-col">
      <div className="min-h-[300px]" onClick={focusEditor}>
        <Editor
          ref={editorRef}
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={blockStyleFn}
          autoCapitalize="sentences"
        />
      </div>
      <Box className="bg-seam-white" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)', paddingTop: 'calc(env(safe-area-inset-bottom, 24px) + 24px)' }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1301 }}>
        <div className="flex flex-row overflow-x-scroll hide-scrollbar space-x-2 my-2 pr-4 ml-4">
          <ButtonContainer>
            <EditorButton onMouseDown={toggleBlockType('unstyled')} active={getBlockType() === 'unstyled'} label="P" styleType="header" />
            {showColorPicker && (
            <div style={{ position: 'absolute', bottom: '60px', zIndex: 1400 }}>
              <TwitterPicker 
                onChangeComplete={(color) => {
                  const colorStyle = `COLOR_${color.hex.replace('#', '').toUpperCase()}`;
                  applyColor(colorStyle);
                  setSelectedColor(color.hex);
                  setShowColorPicker(false);
                }}
              />
            </div>
            )}
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
            <EditorButton 
              onMouseDown={() => setShowColorPicker(!showColorPicker)} 
              active={showColorPicker} 
              label={<div style={{ width: '24px', height: '24px', backgroundColor: selectedColor, borderRadius: '50%' }}></div>} 
              styleType="style" 
            />
          </ButtonContainer>
          <ButtonContainer>
            <EditorButton onMouseDown={toggleBlockType('unordered-list-item')} active={getBlockType() === 'unordered-list-item'} label={<List size={24} color="black" />} styleType="list" />
            <EditorButton onMouseDown={toggleBlockType('ordered-list-item')} active={getBlockType() === 'ordered-list-item'} label={<NumberedList className="h-[16px] w-[19px]" />} styleType="list" />
          </ButtonContainer>
          <ButtonContainer>
            <EditorButton onMouseDown={(e) => applyAlignment('left')} active={activeAlignment === 'left'} label={<AlignLeft size={24} />} styleType="alignment" />
            <EditorButton onMouseDown={(e) => applyAlignment('center')} active={activeAlignment === 'center'} label={<AlignCenter size={24} color="black" />} styleType="alignment" />
            <EditorButton onMouseDown={(e) => applyAlignment('right')} active={activeAlignment === 'right'} label={<AlignRight size={24} color="black" />} styleType="alignment" />
          </ButtonContainer>
        </div>
        <div className="px-4">
          <SeamSaveButton onClick={saveContent} />
        </div>
      </Box>
    </div>
  );
};

export default TextEditor;