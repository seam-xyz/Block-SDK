import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { isPlatform } from '@ionic/react';
import { Box, CircularProgress, Button } from '@mui/material';
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { nanoid } from 'nanoid';
import SeamSaveButton from '../components/SeamSaveButton';
import Block from './Block';
import { BlockModel } from './types';
import './BlockStyles.css';

interface CameraBlockProps {
  onFinalize: (photoUrl: string) => void;
}

const CameraBlock: React.FC<CameraBlockProps> = ({ onFinalize }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const openCamera = async () => {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          quality: 90,
        });
        setSelectedPhoto(photo.webPath!);
      } catch (error) {
        console.error('Error opening camera', error);
        setCameraError('Camera is disabled or permissions denied.');
      }
    };

    const openWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error opening webcam', error);
        setCameraError('Webcam is disabled or permissions denied.');
      }
    };

    if (isPlatform('hybrid')) {
      openCamera();
    } else {
      openWebcam();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setSelectedPhoto(dataUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const uploadPhoto = async (photoUri: string) => {
    setUploading(true);
    const name = nanoid();
    const path = `files/${name}`;

    try {
      // Fetch the photo URI and convert to Blob
      const response = await fetch(photoUri);
      const blob = await response.blob();

      // Upload the Blob to Firebase Storage
      await FirebaseStorage.uploadFile({
        path,
        blob,
      }, async (event, error) => {
        if (error) {
          console.error('Upload failed:', error);
          setUploading(false);
          return;
        }
        if (event) {
          setUploadProgress(event.progress * 100);
        }

        if (event && event.completed) {
          const { downloadUrl } = await FirebaseStorage.getDownloadUrl({ path });
          onFinalize(downloadUrl);
          setUploading(false);
        }
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploading(false);
    }
  };

  useEffect(() => {
    if (selectedPhoto) {
      uploadPhoto(selectedPhoto);
    }
  }, [selectedPhoto]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {uploading ? (
        <CircularProgress variant="determinate" value={uploadProgress} />
      ) : cameraError ? (
        <p>{cameraError}</p>
      ) : selectedPhoto ? (
        <div className="mt-4">
          <img src={selectedPhoto} alt="Selected" className="max-w-full rounded" />
        </div>
      ) : (
        <>
          <video ref={videoRef} className="w-full h-full" />
        </>
      )}
      <Box
        className="bg-white"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
          paddingTop: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}
      >
        {selectedPhoto ? (
          <SeamSaveButton onClick={() => onFinalize(selectedPhoto)} />
        ) : (
          <Button onClick={takePhoto} variant="contained" color="primary" className="w-full mb-4 bg-seam-blue h-[60px]">
            Take Photo
          </Button>
        )}
      </Box>
    </div>
  );
};

export default class CameraBlockWrapper extends Block {
  constructor(model: BlockModel, theme: any) {
    super(model, theme);
  }

  render() {
    const url = this.model.data.photoUrl;
    if (!url) {
      return this.renderErrorState();
    }

    return (
      <div style={{ display: 'block', width: '100%' }}>
        <img src={url} style={{ width: '100%', height: 'auto' }} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinalize = (photoUrl: string) => {
      this.model.data.photoUrl = photoUrl;
      done(this.model);
    };

    return <CameraBlock onFinalize={onFinalize} />;
  }

  renderErrorState() {
    return (
      <img
        src="https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-600nw-2179364083.jpg"
        title="Image"
        style={{ height: '100%', width: '100%' }}
      />
    );
  }
}