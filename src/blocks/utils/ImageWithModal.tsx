import React, { useState } from 'react';
import { Dialog, IconButton, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Zoom } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

// Initialize Swiper modules
SwiperCore.use([Navigation, Zoom]);

interface ImageWithModalProps {
  urls: string[]; // Array of image source URLs
}

const ImageWithModal: React.FC<ImageWithModalProps> = ({ urls }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <style>
        {`
          .hide-navigation-buttons .swiper-button-next,
          .hide-navigation-buttons .swiper-button-prev {
            display: none;
          }
        `}
      </style>
      <div style={{ display: 'flex', cursor: 'pointer', gap: '10px' }} onClick={(e) => handleOpen(e)}>
        {urls.map((src, index) => ( // conditional styling for 1 image vs many
          <img key={index} src={src} style={{ width: urls.length === 1 ? "100%" : "auto", maxWidth: '300px', height: urls.length === 1 ? "auto" : "300px", objectFit: 'cover' }} alt="Thumbnail" />
        ))}
      </div>
      {/* full screen image modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        PaperProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.9)', boxShadow: 'none', paddingTop: 'env(safe-area-inset-top)' } }}
      >
        <IconButton
          onClick={handleClose}
          style={{ position: 'absolute', right: '10px', top: '60px', color: 'white', zIndex: 1302 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{ padding: 0 }}>
          <Swiper
            style={{ height: '100%', width: '100%' }}
            zoom={true}
            navigation={true}
            className="hide-navigation-buttons"
            keyboard={{ enabled: false }}
          >
            {urls.map((url, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container"> {/* class needed for pinch-zoom */}
                  <img src={url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Full screen" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageWithModal;
