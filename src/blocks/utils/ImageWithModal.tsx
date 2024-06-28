import { useEffect, useRef, useState, FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import { Navigation, Zoom } from 'swiper/modules';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';

// Initialize Swiper modules
SwiperCore.use([Navigation, Zoom]);

interface ImageWithModalProps {
  urls: string[];
  style?: React.CSSProperties;
}

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSlide: number;
  children: React.ReactNode;
}

const CustomModal: FC<CustomModalProps> = ({ isOpen, onClose, initialSlide, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[1000] overflow-hidden">
      <div
        className="absolute right-10 top-10 text-white text-3xl cursor-pointer"
        onClick={onClose}
        style={{ zIndex: 1040 }} // Ensure the button is always on top
      >
        <CloseIcon />
      </div>
      <div className="h-full w-full flex justify-center items-center">
        {children}
      </div>
    </div>,
    document.body // Renders the modal at the end of the body element
  );
};

const ImageWithModal: FC<ImageWithModalProps> = ({ urls, style }) => {
  const [open, setOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  const handleOpen = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setInitialSlide(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const downscaledURL = (urlString: string) => {
    if (!urlString.includes('seam-social.appspot.com')) {
      return urlString;
    }

    const url = new URL(urlString);
    let pathname = url.pathname;
    let filename = pathname.substring(pathname.lastIndexOf('/') + 1);
    let newFilename = filename + '_1024x1024';
    pathname = pathname.replace(filename, newFilename);
    url.pathname = pathname.split('/').map(part => part === filename ? encodeURIComponent(newFilename) : part).join('/');
  
    return url.toString();
  }

  return (
    <>
      <div className="flex cursor-pointer gap-2.5">
        {urls.map((src, index) => (
          <img key={index} src={downscaledURL(src)} className="object-cover" style={style} alt="Thumbnail" onClick={handleOpen(index)} />
        ))}
      </div>

      <CustomModal isOpen={open} onClose={handleClose} initialSlide={initialSlide}>
        <style>
          {`
            .hide-navigation-buttons .swiper-button-next,
            .hide-navigation-buttons .swiper-button-prev {
              display: none;
            }
          `}
        </style>
        <Swiper
          className="h-full w-full hide-navigation-buttons"
          zoom={true}
          navigation={true}
          modules={[Navigation, Zoom]}
          keyboard={{ enabled: true }}
          initialSlide={initialSlide}
        >
          {urls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-zoom-container">
                <img src={url} className="w-full h-full object-contain" alt="Full screen" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </CustomModal>
    </>
  );
};

export default ImageWithModal;