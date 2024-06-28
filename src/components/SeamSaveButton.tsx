import React from 'react';
import { Button } from '@mui/material';

interface SeamSaveButtonProps {
  onClick: any;
}

const SeamSaveButton: React.FC<SeamSaveButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-between items-center w-full h-[60px]">
      <Button
        variant="contained"
        fullWidth
        onClick={onClick}
        className="save-modal-button"
      >
        Preview
      </Button>
    </div>
  );
};

export default SeamSaveButton;
