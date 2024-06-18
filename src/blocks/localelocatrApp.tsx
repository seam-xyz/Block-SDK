import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { NationDropdown } from './temp_locale_components/NationDropdown';
import React from "react";
import { GoogleMap, StreetViewPanorama } from "@react-google-maps/api";
import { LoadScript } from "@react-google-maps/api";
import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
import Streetview from 'react-google-streetview';

const api_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!

console.log(api_Key)


Streetview
function Map2() {
  const containerStyle = {
    height: "400px",
    width: "800px"
  };

  const center = {
    lat: 54.364442,
    lng: 18.643173
  };
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      <StreetViewPanorama/>
    </GoogleMap>
  );
}

type Nation = {
  id: number;
  name: string;
  flag: string;
  lat: number;
  lng: number;
}

type NationDict = Record<number, Nation>;
const nations: NationDict = {
  1: {
    id: 1,
    name: "China",
    flag: "🇨🇳",
    lat: 0,
    lng: 0,
  },
  2: {
    id: 2,
    name: "United States",
    flag: "🇺🇸",
    lat: 0,
    lng: 0,
  },
  3: {
    id: 3,
    name: "India",
    flag: "🇮🇳",
    lat: 0,
    lng: 0,
  },
  4: {
    id: 4,
    name: "Japan",
    flag: "🇯🇵",
    lat: 0,
    lng: 0,
  },
  5: {
    id: 5,
    name: "Germany",
    flag: "🇩🇪",
    lat: 0,
    lng: 0,
  },
}

const randomNation = (): Nation => {
  const randomSeed = Math.random() * Object.keys(nations).length
  const index = Math.floor(randomSeed) + 1
  return nations[index]
}









 


const lib = ["places"];



export default class localelocatrBlock extends Block {
  render() {
    return (
      <h1>localelocatr Block!</h1>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <div>
        
        <h1>Edit localelocatr Block!</h1>
        <div> and again again  </div>
        {randomNation().flag}
        <NationDropdown />
        {/** @ts-ignore */}
        <Streetview apiKey={api_Key} />

        
     
      </div>)}
    
  

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}