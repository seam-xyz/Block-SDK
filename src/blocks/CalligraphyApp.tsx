import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import SeamSaveButton from '../components/SeamSaveButton';
import { useEffect, useRef, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/Close';

interface CalligraphyCanvasProps {

}
const CalligraphyCanvas = (props: CalligraphyCanvasProps) => {
  const canvasDivRef = useRef<HTMLDivElement>(null)
  const sketch = (s)
  useEffect( () => new p5(sketch))
  return (
    <div ref={canvasDivRef}></div>
  )
}

interface ColorSwatchProps {
  color: string
  activeColor: string
  onClick: () => void
}
const ColorSwatch = (props: ColorSwatchProps) => {
  return (
    <div className='flex flex-0 basis-[14.285714285%] justify-center'>
      <div className='flex flex-0 place-items-center place-content-center w-10 h-10 rounded-full bg-[#ededed] border-fuchsia-500'
        style={{ borderWidth : props.color === props.activeColor ? '2px' : '0px' }}
        onClick={props.onClick}
      >
        <div className='w-8 h-8 rounded-full border border-white' style={{ backgroundColor: props.color }}>
          
        </div>
      </div>
    </div>
  )
}

interface CalligraphyPaletteProps {
  activeColor: string
  colors: string[]
  onColorSelected: (color: string) => void
}
const CalligraphyPalette = (props: CalligraphyPaletteProps) => {
  return (
    <div className='flex flex-row flex-wrap gap-2 py-2 border-2 rounded-md bg-[#fbfbfb] justify-start'>
      {props.colors.map (color =>
        <ColorSwatch key={color} color={color} onClick={() => props.onColorSelected(color)} activeColor={props.activeColor} />
      )}
    </div>
  )
}

interface CalligraphyToolbarProps {
  activeColor: string
  setActivePaletteTab: (tab: PaletteTab) => void
  activePaletteTab: PaletteTab
}
const CalligraphyToolbar = (props: CalligraphyToolbarProps) => {
  return (
    <div className='flex justify-between'>
      <div className='flex gap-4 border-2 rounded-full p-4 bg-[#fbfbfb]'>
        <div
          className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center border-fuchsia-500'
          onClick={() => props.setActivePaletteTab(PaletteTab.COLOR)}
          style={{ borderWidth: props.activePaletteTab === PaletteTab.COLOR ? '2px' : '0px' }}
        >
          <div className='w-8 h-8 rounded-full border border-white' style={{ backgroundColor: props.activeColor }} />
        </div>
        <div
          className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center border-fuchsia-500'
          onClick={() => props.setActivePaletteTab(PaletteTab.BRUSHES)}
          style={{ borderWidth: props.activePaletteTab === PaletteTab.BRUSHES ? '2px' : '0px' }}
        >
          <EditIcon />
        </div>
        <div
          className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center border-fuchsia-500'
          onClick={() => props.setActivePaletteTab(PaletteTab.BACKGROUNDS)}
          style={{ borderWidth: props.activePaletteTab === PaletteTab.BACKGROUNDS ? '2px' : '0px' }}
        >
          <BorderOuterIcon />
        </div>
      </div>
      <div className='flex gap-4 border-2 rounded-full p-4 bg-[#fbfbfb]'>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><UndoIcon /></div>
        <div className='flex flex-0 w-10 h-10 rounded-full bg-[#ededed] place-items-center place-content-center'><CloseIcon /></div>
      </div>
    </div>
  )
}

enum PaletteTab {
  COLOR,
  BRUSHES,
  BACKGROUNDS
}
interface CalligraphyEditProps {
  onSave: () => void
}
const CalligraphyEdit = (props: CalligraphyEditProps) => {
  const [activeColor, setActiveColor] = useState('#cdb4db');
  const [activePaletteTab, setActivePaletteTab] = useState(PaletteTab.COLOR)

  return (
    <div>
      <h1>Edit Calligraphy Block!</h1>
      <div className='flex flex-1 h-full flex-col gap-6'>
        <CalligraphyCanvas/>
        { activePaletteTab === PaletteTab.COLOR &&
        <CalligraphyPalette
          colors={[ '#cdb4db', '#ffc8ddff', '#ffafccff', '#bde0feff', '#a2d2ffff', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', ]}
          onColorSelected={color => setActiveColor(color)}
          activeColor={activeColor}
        />
        }
        <CalligraphyToolbar activeColor={activeColor} setActivePaletteTab={setActivePaletteTab} activePaletteTab={activePaletteTab} />
      </div>
      <div className='absolute bottom-0 left-0 right-0 p-4'>
        <SeamSaveButton onClick={props.onSave}/>
      </div>
    </div>
  )
}

export default class CalligraphyBlock extends Block {

  render () {
    return (
      <h1>Calligraphy Block!</h1>
    );
  }


  renderEditModal(done: (data: BlockModel) => void) {
    const onSave = () => done(this.model)
    return (
      <CalligraphyEdit onSave={onSave} />
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}