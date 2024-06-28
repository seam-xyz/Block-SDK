import React, { useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import BlockFactory from '../blocks/BlockFactory';
import { createTheme } from "@mui/material/styles";

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

const BlockSelectorModal = ({ selectedBlockType, initialBlockData, setSelectedBlockData }) => {
  const [width, setWidth] = useState(undefined);
  const divRef = useRef(null);
  const isFullscreenEdit = BlockFactory.doesBlockEditFullscreen(selectedBlockType);

  useEffect(() => {
    if (divRef.current && divRef.current.offsetWidth > 0) {
      setWidth(divRef.current.offsetWidth);
    }
  }, [divRef.current]);

  const blockInstance = useMemo(() => {
    const model = {
      type: selectedBlockType,
      data: initialBlockData || {},
      uuid: nanoid()  // Generate a new unique ID
    };

    const instance = BlockFactory.getBlock(model, defaultTheme);
    if (!instance) {
      console.error(`Failed to load block of type ${selectedBlockType}`);
    }

    return instance;
  }, [selectedBlockType]);

  const handleDone = (data) => {
    setSelectedBlockData(data);  // Update the block data in parent component
  };

  return (
    <div ref={divRef} className={isFullscreenEdit ? "h-full" : "mx-4 h-auto"} style={{ overflow: 'visible' }}>
      {selectedBlockType && blockInstance.renderEditModal(handleDone, width)}
    </div>
  );
};

export default BlockSelectorModal;
