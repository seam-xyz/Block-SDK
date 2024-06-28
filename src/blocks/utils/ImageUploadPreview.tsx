import React, { useState } from 'react';
import { IconButton, Box, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageEmptyIcon from "../blockIcons/ImageEmptyIcon.png";
import FileUploadComponent from './FileUploadComponent';
import SeamSaveButton from '../../components/SeamSaveButton';

interface ImageUploadPreviewProps {
  initialUrls: string[];
  onUpdate: (urls: string[]) => void;
  onFinalize: () => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ initialUrls, onUpdate, onFinalize }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialUrls);

  const handleUpdate = (newUrls: string[]) => {
    const updatedUrls = [...previewUrls, ...newUrls];
    setPreviewUrls(updatedUrls);
    onUpdate(updatedUrls);
  };

  const handleRemove = (index: number) => {
    const updatedUrls = previewUrls.filter((_, idx) => idx !== index);
    setPreviewUrls(updatedUrls);
    onUpdate(updatedUrls);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < previewUrls.length) {
      const updatedUrls = [...previewUrls];
      const [movedImage] = updatedUrls.splice(index, 1);
      updatedUrls.splice(newIndex, 0, movedImage);
      setPreviewUrls(updatedUrls);
      onUpdate(updatedUrls);
    }
  };

  return (
    <>
      {previewUrls.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <img src={ImageEmptyIcon} alt="No Images" style={{ width: '150px', height: '150px' }} />
          <h3 className="text-seam-black/20">Choose up to 10 photos.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px', alignItems: 'center', height: 'calc(100vh - 300px)' }}>
          {previewUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative', flex: '0 0 auto' }}>
              <img src={url} style={{ height: "300px", width: 'auto', maxWidth: '300px', objectFit: 'cover' }} />
              <IconButton
                onClick={() => handleRemove(index)}
                style={{ position: 'absolute', right: 0, top: 0, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', margin: 4 }}
              >
                <CloseIcon />
              </IconButton>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                <IconButton
                  onClick={() => moveImage(index, 'left')}
                  disabled={index === 0}
                  size="small"
                >
                  <ArrowBackIosIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => moveImage(index, 'right')}
                  disabled={index === previewUrls.length - 1}
                  size="small"
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
      <Box className="space-y-2" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
        <FileUploadComponent
          fileTypes="image/*"
          label={previewUrls.length > 0 ? "Upload More Images" : "Upload Images"}
          onUpdate={handleUpdate}
          multiple={true}
          maxFiles={10}
        />
        {previewUrls.length > 0 && (
          <SeamSaveButton onClick={onFinalize} />
        )}
      </Box>
    </>
  );
};

export default ImageUploadPreview;