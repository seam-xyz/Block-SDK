import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  noScrollBar: {
    "&::-webkit-scrollbar": {
      display: "none"
    },
    "-ms-overflow-style": "none",  /* IE and Edge */
    "scrollbar-width": "none",  /* Firefox */
  }
});

const TracksList = ({ onChooseTrack, tracks, selectedTrack }) => {
  const classes = useStyles();

  const extractTrackId = (url) => {
    const match = url.match(/(?:track\/)([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  };

  return (
    <>
      {Object.keys(tracks).length > 0 && (
        <div className={`h-full w-full overflow-y-hidden flex hide-scrollbar flex-col`}>
          <Virtuoso
            className={`${classes.noScrollBar} h-auto`}
            style={{ height: 'calc(100% - 100px)' }}
            data={tracks.items}
            overscan={6}
            itemContent={(index, track) => {
              const trackId = extractTrackId(track.external_urls.spotify);
              const isSelected = trackId === selectedTrack;
              return (
                <div className={`flex flex-row h-auto px-4 py-2 ${isSelected ? 'border-seam-pink border-[1px]' : 'border-seam-white/40 border-b-[1px]'} items-center`} onClick={() => { onChooseTrack(track) }}>
                  <img
                    src={track.album.images[0].url}
                    className="w-[96px] h-[96px] mr-4 rounded-[6px]"
                    alt="song artwork"
                  />
                  <div className="flex flex-col items-start justify-center w-full h-full space-y-1">
                    <h3 className="text-seam-white">{track.name}</h3>
                    <h3 className="text-seam-white/40">{track.artists.map((artist) => artist.name).join(', ')}</h3>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}
    </>
  );
};

export default TracksList;