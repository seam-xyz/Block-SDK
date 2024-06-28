import React, { useState, useEffect } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";

const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);

export default function GifViewer({ id }) {
  const [gifData, setGifData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      giphyFetch.gif(id).then(({ data }) => {
        setGifData(data);
      });
    }
    fetchData();
  }, [id]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {gifData && (
        <img
          src={gifData.images.fixed_width_downsampled.webp || gifData.images.fixed_width_downsampled.url}
          className="rounded-lg w-full h-full"
          alt="GIF"
          width="100%"
        />
      )}
    </div>
  );
}