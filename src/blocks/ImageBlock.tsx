import React from 'react';
import Block from './Block';
import { BlockModel } from './types';
import BlockFactory from './BlockFactory';
import './BlockStyles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ImageUploadPreview from './utils/ImageUploadPreview';
import ImageWithModal from './utils/ImageWithModal';

export default class ImageBlock extends Block {
  render(): React.ReactNode {
    let urls = this.model.data['urls'] ? JSON.parse(this.model.data['urls']) : [];
    if (!urls.length && this.model.data['url']) {
      urls = [this.model.data['url']]; // Normalize to array format
    }
  
    if (urls.length === 0) {
      return this.renderErrorState();
    }
  
    if (urls.length === 1) {
      // For only one image, set it to 100% width with max height of 300px
      return (
        <div style={{ display: 'block', width: '100%' }}>
          <ImageWithModal urls={urls} style={{ width: '100%', height: 'auto' }} />
        </div>
      );
    } else {
      // For multiple images, apply a horizontal scroll with image styling similar to ImageUploadPreview
      return (
        <div style={{ display: 'flex', overflowX: 'scroll', gap: '10px', alignItems: 'center', backgroundColor: 'white' }}>
          <ImageWithModal urls={urls} style={{ height: "300px", width: 'auto', maxWidth: '300px' }} />  
        </div>
      );
    }
  }  

  renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
    const initialUrls = this.model.data['urls'] ? JSON.parse(this.model.data['urls']) : (this.model.data['url'] ? [this.model.data['url']] : []);

    const handleUpdate = (urls: string[]) => {
      this.model.data['urls'] = JSON.stringify(urls);  // Always save in new array format
    };

    const handleFinalize = () => {
      done(this.model);  // go to preview step
    };

    return (
      <div className="w-full h-full">
        <ImageUploadPreview 
          initialUrls={initialUrls} 
          onUpdate={handleUpdate} 
          onFinalize={handleFinalize} 
        />
      </div>
    );
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
