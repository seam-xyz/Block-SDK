import React, { useState, useEffect } from 'react';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import './BlockStyles.css';
import ReactPlayer from 'react-player/lazy';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadComponent from './utils/FileUploadComponent';
import SeamSaveButton from '../components/SeamSaveButton';
import EmptyVideoIcon from '../blocks/blockIcons/EmptyVideoIcon.png';

export default class VideoBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    const url = this.model.data["url"];
    if (!url) {
      return this.renderErrorState();
    }

    return (
      <div style={{ backgroundColor: this.theme.palette.secondary.main }}>
        <div className="flex grow relative w-full h-full min-h-[300px]" style={{ position: 'relative', width: "100%", height: "100%" }}>
          <ReactPlayer
            controls={true}
            url={url}
            style={{ height: '100%', width: '100%', flexGrow: 1 }}
          />
        </div>
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
    return <VideoBlockEditor model={this.model} done={done} />;
  }

  renderErrorState() {
    return (
      <h1>Error: Couldn't load the video</h1>
    );
  }
}

const VideoBlockEditor: React.FC<{ model: BlockModel, done: (data: BlockModel) => void }> = ({ model, done }) => {
  const [uploadedUrl, setUploadedUrl] = useState(model.data['url'] || "");

  const handleUpdate = (urls: string[]) => {
    if (urls.length > 0) {
      setUploadedUrl(urls[0]);
      model.data['url'] = urls[0]; // Only one video is allowed
    }
  };

  const handleRemove = () => {
    setUploadedUrl("");
    model.data['url'] = ""; // Clear the video URL
  };

  const handleFinalize = () => {
    done(model); // Go to preview step
  };

  useEffect(() => {
    // Reset the state when component is mounted or updated
    setUploadedUrl(model.data['url'] || "");
  }, [model.data['url']]);

  return (
    <div className="w-full h-full">
      {uploadedUrl ? (
        <div style={{ display: 'block', width: '100%', position: 'relative' }}>
          <div className="flex grow relative w-full h-full min-h-[300px]" style={{ position: 'relative', width: "100%", height: "100%" }}>
            <ReactPlayer
              controls={true}
              url={uploadedUrl}
              style={{ height: '100%', width: '100%', flexGrow: 1 }}
            />
            <IconButton
              onClick={handleRemove}
              style={{ position: 'absolute', right: 0, top: 0, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', margin: 4 }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <Box className="space-y-2" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
            <SeamSaveButton onClick={handleFinalize} />
          </Box>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center mb-[200px]">
            <img src={EmptyVideoIcon} alt="No Videos" style={{ width: '150px', height: '150px' }} />
            <h3 className="text-seam-black/20">Upload a video to get started.</h3>
          </div>
          <Box className="space-y-2" style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
            <FileUploadComponent
              fileTypes="video/*"
              label="Upload a Video"
              onUpdate={handleUpdate}
              multiple={false}
              maxFiles={1}
            />
          </Box>
        </div>
      )}
    </div>
  );
};