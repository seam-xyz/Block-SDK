import React from 'react';
import TracksList from './TracksList';

const SearchResult = (props) => {
  const {
    onChooseTrack,
    tracks,
    selectedTrack,
  } = props;

  return (
    <>
      {tracks && <TracksList onChooseTrack={onChooseTrack} tracks={tracks} selectedTrack={selectedTrack} />}
    </>
  );
};

export default SearchResult;