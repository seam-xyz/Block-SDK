// NOTE: This is a testing harness so you can resize your new block similar to how it will look on www.seam.so
// Don't edit anything in this file, it won't be reflected in production.

import React, { useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { withSize } from "react-sizeme";
import Widget from "./Widget";
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import { createTheme } from "@mui/material/styles";
import Feed from "./Feed";

// Blocks
import BlockFactory from './blocks/BlockFactory';
import { Grid } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#020303"
    },
    secondary: {
      main: "#1C1C1C"
    },
    info: {
      main: "#CCFE07" // Button Background
    }
  },
  typography: {
    fontFamily: "monospace"
  },
});

function Content({ size: { width }, loadedBlocks }) {
  const [layouts, setLayouts] = useState({ lg: [{ x: 0, y: 0, w: 5, h: 15, i: "test" }] });
  const [blocks, setBlocks] = useState(loadedBlocks);
  const breakpoint = 620
  const isMobileScreen = window.innerWidth < breakpoint

  const [isEditingBlock, setIsEditingBlock] = useState(-1) // number is the index of the block being edited
  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  // incoming blockUUID
  const onRemoveItem = (itemId) => {
    setBlocks(blocks.filter((model) => model.uuid !== itemId));
  };

  const onEditItem = (itemId) => {
    const indexOfEditedBlock = blocks.findIndex(element => element.uuid === itemId)
    console.log("editing block " + indexOfEditedBlock)
    setIsEditingBlock(indexOfEditedBlock)
  };

  // eslint-disable-next-line
  const onAddItem = (blockName) => {
    const newBlock = {
      type: blockName,
      data: {},
      uuid: uuidv1()
    }
    setBlocks([...blocks, newBlock]);
  };
  const renderBlock = (model) => {
    let block = BlockFactory.getBlock(model, defaultTheme)
    block.onEditCallback = onEditItem
    return block.render()
  }
  const renderBlockEditModal = () => {
    const block = isEditingBlock !== -1 ? BlockFactory.getBlock(blocks[isEditingBlock]) : null
    return (
      <Modal
        open={isEditingBlock !== -1}
        footer={null}
        onClose={() => setIsEditingBlock(-1)}
        style={{
          overflow: 'scroll',
          display: 'block',
          fontSize: "16px",
          fontWeight: "500"
        }}
      >
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
            padding: "15px",
            width: isMobileScreen ? "95%" : "500px",
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, 0)',
          }}
        >
          {"Edit Block " + isEditingBlock}
          {block?.renderEditModal(saveBlockData)}
        </Card>
      </Modal>
    );
  }

  const saveBlockData = (data) => {
    let blocksCopy = blocks
    blocksCopy[isEditingBlock] = data
    setBlocks(blocksCopy)
    setIsEditingBlock(-1)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, xxs: 0 }}
          cols={{ lg: 12, xxs: 2 }}
          rowHeight={5}
          width={width / 2}
          onLayoutChange={onLayoutChange}
          resizeHandles={['se']}
        >
          {blocks.map((model, index) => (
            <div
              key={model.uuid}
              className="widget"
              data-grid={{ w: 5, h: 15, x: 0, y: Infinity }}
            >
              <Widget id={model.uuid}
                onRemoveItem={onRemoveItem}
                onEditItem={onEditItem}
              >
                {renderBlock(model)}
              </Widget>
            </div>
          ))}
        </ResponsiveGridLayout>
      </Grid>
      <Grid item xs={6}>
        <Feed />
      </Grid>
      {renderBlockEditModal()}
    </Grid>
  );
}

export default withSize({ refreshMode: "debounce", refreshRate: 60 })(Content);