import { Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import IframelyCard from './IframelyCard';

const Iframely = ({ url, style }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [html, setHtml] = useState({ __html: '<div />' });

  useEffect(() => {
    const fetchEmbed = async () => {
      try {
        const response = await fetch(
          `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(url)}&key=${process.env.REACT_APP_IFRAMELY_KEY}&iframe=0&omit_script=1`
        );
        const data = await response.json();
        if (data.html) {
          setHtml({ __html: data.html });
          setError(null);
        } else {
          setError(data.message || 'Failed to fetch embed.');
        }
      } catch (error) {
        setError('Error fetching embed.');
      } finally {
        setIsLoaded(true);
      }
    };

    fetchEmbed();
  }, [url]);

  useEffect(() => {
    window.iframely && window.iframely.load();
  }, [html]);

  if (error) {
    return <IframelyCard url={url} />;
  } else if (!isLoaded) {
    return <Skeleton variant="rectangular" width={"100%"} height={120} />;
  } else {
    return <div dangerouslySetInnerHTML={html} style={style} />;
  }
};

export default Iframely;