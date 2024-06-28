import React, { useState, useEffect, useRef } from 'react';
import Block from './Block';
import { BlockModel } from './types';
import { Geolocation } from '@capacitor/geolocation';
import './BlockStyles.css';
import { Search } from 'react-feather';
import Iframely from './utils/Iframely';

export default class MapBlock extends Block {
  render() {
    const locationUrl = this.model.data['url'];

    if (!locationUrl) {
      return this.renderEmptyState();
    }

    return (
      <div className="relative w-full h-full">
        <Iframely url={locationUrl} style={{ height: '100%' }} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <div className="relative flex flex-col items-center rounded-lg bg-gray-100 h-full">
        <MapEditor
          onSelect={(locationUrl: string) => {
            this.model.data['url'] = locationUrl; // Store as URL string
            done(this.model);
          }}
        />
      </div>
    );
  }

  renderEmptyState() {
    return <h1>Please select a location</h1>;
  }

  renderErrorState() {
    return <h1>Error: Invalid location data!</h1>; // Provide more informative error feedback
  }
}

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface PlaceResult {
  geometry: {
    location: any;
  };
  formatted_address?: string;
  name: string;
}

interface MapEditorProps {
  onSelect: (locationUrl: string) => void;
}

const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
};

const MapEditor: React.FC<MapEditorProps> = ({ onSelect }) => {
  const [location, setLocation] = useState<LatLngLiteral | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

    if (!window.google) {
      loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`)
        .then(() => setLoaded(true))
        .catch((error) => console.error('Google Maps script failed to load', error));
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition().then((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    if (loaded && mapRef.current && location) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });

      const input = searchBoxRef.current!;
      const searchBox = new google.maps.places.SearchBox(input);

      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places && places.length > 0) {
          const place: any = places[0];
          if (place.geometry) {
            const newLocation = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setLocation(newLocation);

            // Generate a URL consistent with the working URL format
            const locationUrl = place.formatted_address
              ? `https://www.google.com/maps/place/${encodeURIComponent(place.formatted_address)}/@${newLocation.lat},${newLocation.lng},14z`
              : `https://www.google.com/maps/search/?api=1&query=${newLocation.lat},${newLocation.lng}`;
            onSelect(locationUrl);
            map.setCenter(newLocation);
            new google.maps.Marker({
              position: newLocation,
              map: map,
            });
          } else {
            console.error('Place has no geometry: ', place);
          }
        }
      });
    }
  }, [loaded, location, onSelect]);

  return (
    <div className="relative w-full h-full mt-[72px] mb-[72px]">
      <div ref={mapRef} className="w-auto h-full rounded-[24px]" style={{ marginLeft: '16px', marginRight: '16px' }} />
      <div className="absolute top-0 w-full h-auto pt-16 flex items-start justify-center bg-transparent">
        <div className="relative flex items-center justify-center w-11/12 h-auto">
          <div className="absolute left-0 flex items-center pl-3 mb-2">
            <Search className="text-gray-500" />
          </div>
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="Search for a place"
            className="rounded-full py-2 pl-10 pr-4 border border-gray-300 placeholder:ml-1 focus:outline-none focus:ring-2 focus:ring-seam-blue mb-2 bg-white shadow-lg w-full"
          />
        </div>
      </div>
    </div>
  );
};