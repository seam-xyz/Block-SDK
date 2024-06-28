import Block from './Block';
import { BlockModel } from './types';
import './BlockStyles.css';
import { Stack, Box } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import SeamSaveButton from '../components/SeamSaveButton';
import Iframely from './utils/Iframely';
import SpotifySearchBar from './utils/SpotifySearch/SpotifySearchBar';

interface Music {}

const SearchScreen: React.FC<any> = ({ done, model, onFinalize }) => {
  const [url, setUrl] = useState<string>(model.data.url || '');
  const extractTrackUrl = (track: any) => {
    return track.external_urls.spotify;
  };

  const handleChooseTrack = (track: any) => {
    const trackUrl = extractTrackUrl(track);
    setUrl(trackUrl);
  };

  return (
    <div className="bg-seam-black w-full h-full flex flex-col items-center max-w-[600px] overflow-y-hidden hide-scrollbar">
      <div className="w-full h-full flex flex-col mt-[24px] items-center justify-center overflow-y-hidden hide-scrollbar space-y-3">
        <h3 style={{ color: 'white' }}> Music by Spotify </h3>
        <h3 className="" style={{ color: 'white', marginBottom: '44px', }}>Share the music that you love</h3>
        <SpotifySearchBar
          onChooseTrack={handleChooseTrack}
          selectedTrack={url}
        />
      </div>
      <Box className="bg-seam-black" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)', paddingTop: 'calc(env(safe-area-inset-bottom, 24px) + 24px)' }} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'background.paper', boxShadow: 3, zIndex: 1301 }}>
        <SeamSaveButton onClick={() => onFinalize(url)} />
      </Box>
    </div>
  );
};

export default class MusicBlock extends Block {
  render() {
    const { data } = this.model;

    if (!data.url) {
      return <h1>No song selected</h1>;
    }

    return (
      <div style={{ backgroundColor: this.theme.palette.secondary.main, width: "100%", height: "100%" }}>
        {data.title && <h2 className="text-white text-center p-2">{data.title}</h2>}
        <Iframely
          url={data.url}
          style={{
            display: "flex",
            height: `100%`,
            width: `100%`
          }}
        />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void): React.ReactNode {
    const onFinalize = (url: string) => {
      this.model.data.url = url; // store selected URL in model
      done(this.model); // go to preview step
    };

    return (
      <SearchScreen done={done} model={this.model} onFinalize={onFinalize} />
    );
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    );
  }
}