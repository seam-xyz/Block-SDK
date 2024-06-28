import React, { useState } from 'react';
import { initiateGetResult } from './actions/result';
import SearchResult from './components/SearchResult';
import SearchForm from './components/SearchForm';
import LinearProgress from '@mui/material/LinearProgress';
import * as Sentry from "@sentry/react";

// Inspired by https://dev.to/myogeshchavan97/how-to-create-a-spotify-music-search-app-in-react-328m
const SpotifySearchBar = ({ onChooseTrack, selectedTrack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tracks, setTracks] = useState(undefined);

  const handleSearch = (searchTerm) => {
    setIsLoading(true);

    initiateGetResult(searchTerm)().then((tracks) => {
      setIsLoading(false);
      if (tracks == undefined) {
        Sentry.captureException("Song step broken")
        setError(true)
      } else {
        setError(false)
        setTracks(tracks)
      }
    });
  };

  const errorMessage = () => {
    return (
      <h3 style={{ color: "red", paddingTop: 10 }}> Unable to search for songs -- are you blocking cookies? </h3>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start w-full overflow-y-hidden hide-scrollbar h-full">
        <SearchForm handleSearch={handleSearch} />
        {error && errorMessage()}
        {isLoading && <LinearProgress sx={{ color: '#0051E8', '& .MuiLinearProgress-bar': { backgroundColor: '#EE39FB' }}} />}
        {tracks && <SearchResult
          onChooseTrack={onChooseTrack}
          tracks={tracks}
          selectedTrack={selectedTrack}
        />}
      </div>
    </>
  );
};

export default SpotifySearchBar;