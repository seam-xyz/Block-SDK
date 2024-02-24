import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'

import CSS from 'csstype';
import React, { useEffect, useRef, useState } from 'react';

interface CanvasInitialUserState {
  initialBackgroundColor: string,  // Hex string e.g. '#123abc'
}

interface CanvasProps {
  height: number,
  width: number,
  isEditMode: boolean
  userInitialState: CanvasInitialUserState 
}

const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
  const {
    height,
    width,
    isEditMode,
  } = props;

  // === Initialize ===
  const {initialBackgroundColor} = props.userInitialState;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundColor, setBackgroundColor] = useState(initialBackgroundColor || '#f2f2f2');

  const canvasStyles: CSS.Properties = {
    cursor: isEditMode ? 'pointer' : 'default',
    aspectRatio: 1,
    backgroundColor: backgroundColor,
    display: 'block',
  }

  // === Methods to Update Canvas ===
  // FUTURE: Expose as a customizable callback in props, this is default behavior
  const clearCanvas = () => {
    const canvasContext = canvasRef?.current?.getContext('2d');
    if (!canvasContext) {
      return;
    }

    canvasContext.fillStyle = backgroundColor;
    canvasContext.fillRect(0, 0, width, height);
  }

  // FUTURE: Expose as a customizable callback in props, takes a canvas context as an arg, can be used to access canvas
  const draw = () => {
    clearCanvas();
  }

  // === Handle Renders and Re-renders ===
  // Handle drawing on the canvas
  useEffect(() => {
    // TODO: Validate?
    
  })

  // Update sate variables based on changes to props
  useEffect(() => {
    // Update state variables based on changes to props
    // initialPixels && setPixels(initialPixels);
    // setShowGrid(shouldShowGridInViewMode || isEditMode);
    draw();
  }, [props])

  // === Finally, Return ===
  return (
    <canvas
        ref={canvasRef}
        width={width + 'px'}
        height={height + 'px'}
        style={canvasStyles}
        // onMouseDown={handleCanvasClick}
        // onMouseMove={handleCanvasDrag}
        // onMouseUp={() => setIsMouseDownOnCanvas(false)}
        onContextMenu={(e) => e.preventDefault()}
      />
  )
}

// stringSizeToNumber takes an input size string like '400px' and returns 400
function stringSizeToNumber(size: string | undefined): number {
  if (size === undefined) {
    // handle edge case, size should never be undefined from Seam render
    return 400
  }
  const regexMatch = size.match(/\d+/)
  if (!regexMatch) {
    return 0
  }
  return parseInt(regexMatch[0])
}

export default class WhiteboardBlock extends Block {
  render(width?: string, height?: string) {
    const userInitialState = {
      initialBackgroundColor: '#abc123',
    }
    return (
      <>
        <h1>{'wassup'}</h1>
        <Canvas
          width={stringSizeToNumber(width)}
          height={stringSizeToNumber(height)}
          isEditMode={false}
          userInitialState={userInitialState}
        />
      </>
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