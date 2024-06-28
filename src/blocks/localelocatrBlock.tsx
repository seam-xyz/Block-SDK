import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css';
import React, { useEffect, useRef, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { LoadScript } from "@react-google-maps/api";
import { OutputFormat, setDefaults } from 'react-geocode';
import { Autocomplete, Button, Paper, TextField, Typography } from '@mui/material';


const api_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!

type Nation = {
  iso2: string;
  iso3: string;
  name: string;
  capital: string;
  flag: string;
  lat: number;
  lng: number;
}

//defaults for google GeoCode API
setDefaults({
  key: api_Key,
  language: "en",
  region: "us-east-1",
  outputFormat: OutputFormat.XML
});

// Currently pulling full world data from a public raw file on github
// Probably needs a long term home on Seam server
const nationDataUrl = 'https://raw.githubusercontent.com/yablochko8/country-lists/main/world.json';

//dictionary of countrys - key:ISO code
//This is the  object that the streetview gets picked from
const initialWorldDictionary: { [key: string]: Nation } = {
  us: {
    "iso2": "us",
    "iso3": "usa",
    "name": "United States",
    "capital": "Washington, D.C.",
    "flag": "🇺🇸",
    "lat": 38.9072,
    "lng": -77.0369
  },
  ca: {
    "iso2": "ca",
    "iso3": "can",
    "name": "Canada",
    "capital": "Ottawa",
    "flag": "🇨🇦",
    "lat": 45.4215,
    "lng": -75.6972
  },
  mx: {
    "iso2": "mx",
    "iso3": "mex",
    "name": "Mexico",
    "capital": "Mexico City",
    "flag": "🇲🇽",
    "lat": 19.4326,
    "lng": -99.1332
  },
  gb: {
    "iso2": "gb",
    "iso3": "gbr",
    "name": "United Kingdom",
    "capital": "London",
    "flag": "🇬🇧",
    "lat": 51.5074,
    "lng": -0.1278
  },
  nl: {
    "iso2": "nl",
    "iso3": "nld",
    "name": "Netherlands",
    "capital": "Amsterdam",
    "flag": "🇳🇱",
    "lat": 52.3676,
    "lng": 4.9041
  },
  be: {
    "iso2": "be",
    "iso3": "bel",
    "name": "Belgium",
    "capital": "Brussels",
    "flag": "🇧🇪",
    "lat": 50.8503,
    "lng": 4.3517
  },
  pl: {
    "iso2": "pl",
    "iso3": "pol",
    "name": "Poland",
    "capital": "Warsaw",
    "flag": "🇵🇱",
    "lat": 52.2297,
    "lng": 21.0122
  },
  se: {
    "iso2": "se",
    "iso3": "swe",
    "name": "Sweden",
    "capital": "Stockholm",
    "flag": "🇸🇪",
    "lat": 59.3293,
    "lng": 18.0686
  },
  no: {
    "iso2": "no",
    "iso3": "nor",
    "name": "Norway",
    "capital": "Oslo",
    "flag": "🇳🇴",
    "lat": 59.9139,
    "lng": 10.7522
  },
  fi: {
    "iso2": "fi",
    "iso3": "fin",
    "name": "Finland",
    "capital": "Helsinki",
    "flag": "🇫🇮",
    "lat": 60.1695,
    "lng": 24.9355
  },
  ie: {
    "iso2": "ie",
    "iso3": "irl",
    "name": "Ireland",
    "capital": "Dublin",
    "flag": "🇮🇪",
    "lat": 53.3498,
    "lng": -6.2603
  },
  pt: {
    "iso2": "pt",
    "iso3": "prt",
    "name": "Portugal",
    "capital": "Lisbon",
    "flag": "🇵🇹",
    "lat": 38.7223,
    "lng": -9.1393
  },
  gr: {
    "iso2": "gr",
    "iso3": "grc",
    "name": "Greece",
    "capital": "Athens",
    "flag": "🇬🇷",
    "lat": 37.9838,
    "lng": 23.7275
  },
  kr: {
    "iso2": "kr",
    "iso3": "kor",
    "name": "South Korea",
    "capital": "Seoul",
    "flag": "🇰🇷",
    "lat": 37.5665,
    "lng": 126.9780
  },
  tw: {
    "iso2": "tw",
    "iso3": "twn",
    "name": "Taiwan",
    "capital": "Taipei",
    "flag": "🇹🇼",
    "lat": 25.0330,
    "lng": 121.5654
  },
  th: {
    "iso2": "th",
    "iso3": "tha",
    "name": "Thailand",
    "capital": "Bangkok",
    "flag": "🇹🇭",
    "lat": 13.7563,
    "lng": 100.5018
  },
  id: {
    "iso2": "id",
    "iso3": "idn",
    "name": "Indonesia",
    "capital": "Jakarta",
    "flag": "🇮🇩",
    "lat": -6.2088,
    "lng": 106.8456
  },
  my: {
    "iso2": "my",
    "iso3": "mys",
    "name": "Malaysia",
    "capital": "Kuala Lumpur",
    "flag": "🇲🇾",
    "lat": 3.1390,
    "lng": 101.6869
  },
  sg: {
    "iso2": "sg",
    "iso3": "sgp",
    "name": "Singapore",
    "capital": "Singapore",
    "flag": "🇸🇬",
    "lat": 1.3521,
    "lng": 103.8198
  },
  nz: {
    "iso2": "nz",
    "iso3": "nzl",
    "name": "New Zealand",
    "capital": "Wellington",
    "flag": "🇳🇿",
    "lat": -41.2865,
    "lng": 174.7762
  },
  cl: {
    "iso2": "cl",
    "iso3": "chl",
    "name": "Chile",
    "capital": "Santiago",
    "flag": "🇨🇱",
    "lat": -33.4489,
    "lng": -70.6693
  },
  co: {
    "iso2": "co",
    "iso3": "col",
    "name": "Colombia",
    "capital": "Bogotá",
    "flag": "🇨🇴",
    "lat": 4.7110,
    "lng": -74.0721
  },
  pe: {
    "iso2": "pe",
    "iso3": "per",
    "name": "Peru",
    "capital": "Lima",
    "flag": "🇵🇪",
    "lat": -12.0464,
    "lng": -77.0428
  },
  za: {
    "iso2": "za",
    "iso3": "zaf",
    "name": "South Africa",
    "capital": "Pretoria",
    "flag": "🇿🇦",
    "lat": -25.7479,
    "lng": 28.2293
  },
  il: {
    "iso2": "il",
    "iso3": "isr",
    "name": "Israel",
    "capital": "Jerusalem",
    "flag": "🇮🇱",
    "lat": 31.7683,
    "lng": 35.2137
  },
  ad: {
    "iso2": "ad",
    "iso3": "and",
    "name": "Andorra",
    "capital": "Andorra la Vella",
    "flag": "🇦🇩",
    "lat": 42.5078,
    "lng": 1.5211
  },
};

/* ************ HELPER FUNCTIONS ********** */

//props -  latitude and longitude of two locations(in degrees)
//return - distance in km between the two given locations (straight line from point a to point b)
function calcDist(nation1: Nation, nation2: Nation) {

  function toRad(value: number) {
    // Converts numeric degrees to radians
    return value * Math.PI / 180
  }
  const lat1 = toRad(nation1.lat)
  const lat2 = toRad(nation2.lat)
  const lng1 = toRad(nation1.lng)
  const lng2 = toRad(nation2.lng)
  var R = 6371; // km
  var dLat = lat2 - lat1
  var dLon = lng2 - lng1

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}


//converts KM to miles
function convertKmToMiles(km: number) {
  return km * 0.621371;
}

//returns a random Nation from the nation dictionary
const randomNation = (nations: Nation[]): Nation => {
  const randomIndex = Math.floor(Math.random() * nations.length)
  return nations[randomIndex]
}

//finds center between correct location and guess location (used to as center of map in image)
const findCenter = (nation1: Nation, nation2: Nation): { lat: number, lng: number } => {
  // subtracted 30 have the path show higher on the screen
  const centerLat = ((nation1.lat + nation2.lat) / 2) - 30
  const centerLng = (nation1.lng + nation2.lng) / 2
  return { lat: centerLat, lng: centerLng }

}

//returns a full list  of countries to pick from
async function fetchNationData(sourceUrl: string): Promise<{ [key: string]: Nation }> {
  try {
    // Fetch the JSON data
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error('Error during fetchNationData: Response not ok.');
    }
    const dictionary: { [key: string]: Nation } = await response.json();
    return dictionary
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error;
  }
}

/* ************ HELPER FUNCTIONS ********** */

/* ************ DROPDOWN FUNCTIONS ********** */

function createNationArray(dictionary: { [key: string]: Nation }): Nation[] {
  const nationArray: Nation[] = Object.values(dictionary);
  nationArray.sort((a, b) => a.name.localeCompare(b.name));
  return nationArray;
}

//gets a sorted list of country names to return
const initialWorldArray = createNationArray(initialWorldDictionary)

//component for Country search bar
function NationDropdown({ onSelect }: { onSelect: Function }) {
  const [allNations, setAllNations] = useState<Nation[]>(initialWorldArray)
  const [inputValue, setInputValue] = useState<string>('');
  const [guess, setGuess] = React.useState<string>("");


  // "selection" here means user clicking a country as their guess, or highlighting it and pressing Enter
  const selectionHandler = (id: string) => {
    if(id !== null){
      let selectedNation = allNations.find(nation => nation.flag + " " + nation.name === id)
      
      if (!selectedNation) throw new Error("selectionHandler called with invalid ISO2 code");
      else {
        onSelect(selectedNation)
      }
    }
    else{

      onSelect(null)

    }
      
  }

  useEffect(() => {
    const init = async () => {
      const fullNationList = createNationArray(await fetchNationData(nationDataUrl))
      setAllNations(fullNationList)
    }
    init()
  },[])

  const options = allNations.map((nation) => (nation.flag + " " + nation.name));

  //used window inner width for sizing for multiple devices
  return (
    
      <Autocomplete
        className='bg-white rounded-2xl shadow-lg'
        size='small'
        value={guess}
        onChange={(event: any, newValue: string | null) => {
          
            setGuess(newValue!);
            selectionHandler(newValue!);
          
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}

        options={options}
        disablePortal
        sx={{
          width: "75vw", maxWidth: 500, "& .MuiOutlinedInput-root": {
            borderRadius: "0",
            padding: "0",
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "none"
          },
          
        }}
        PaperComponent={(props) => (
          <Paper
            sx={{
              borderRadius:"15px"
              
            }}
            {...props}
          />
        )}
        renderInput={(params) => <TextField {...params}  />}
      />

  )
}

/* ************ DROPDOWN FUNCTIONS ********** */

let trueLocation: Nation = randomNation(initialWorldArray)

//gets geocode information for correct Country - Given a latitude and longitude, return a street address and country
async function getGeocodeResponse() {
  const geocodeAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + trueLocation.lat + "," + trueLocation.lng + "&key=" + api_Key
  try {
    const response = await fetch(geocodeAPI);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

/* ************ COMPONENT FUNCTIONS ********** */

//container for streetview
const containerStyle = {
  width: '100%',
  height: '700px',
};

//streetview react component
const StreetView: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(true);


  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      // Create a StreetViewPanorama instance and link it to the map
      streetViewRef.current = new google.maps.StreetViewPanorama(
        document.getElementById('street-view') as HTMLElement,
        {
          position: trueLocation,
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
          addressControl: false,
          fullscreenControlOptions: {

          }
        }
      );
      mapRef.current.setStreetView(streetViewRef.current);

      // Hide the map after initializing Street View
      setShowMap(false);

      getGeocodeResponse()
        .then(response => {
          const data = response.results
          const streetAddress = data[0].formatted_address
        })
        .catch(error => {
          console.error('Error fetching the geocode data:', error);
        });
    }
  }, [isMapLoaded]);

  return (
    <LoadScript googleMapsApiKey={api_Key}>
      <div className="rounded-3xl" id="street-view" style={containerStyle}></div>

      {showMap && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={trueLocation}
          zoom={14}
          onLoad={(map) => {
            mapRef.current = map;
            setIsMapLoaded(true);  // Set the map as loaded
          }}
          options={{
            streetViewControl: false,
          }}
          clickableIcons={false}
        />
      )}
    </LoadScript>
  );
};



type LocaleLocatrProps = {
  onSave: (url: string, answer: Nation, guess: Nation) => void;
}

const LocaleLocatr = ({ onSave }: LocaleLocatrProps) => {
  const [guess, setGuess] = useState<Nation | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")

  // Stage one: make a guess
  useEffect(() => {
    if (guess) {

      const newImageUrl: string = getDistanceImageUrl(trueLocation, guess)
      setImageUrl(newImageUrl)

    }
    else{
      //resets image incase a user chooses a item then clears bar
      setImageUrl("");
    }
  }, [guess])


  return (
    <>

      <div className="relative">
        <div className="absolute top-1 left-1 z-10 p-2 ">
          <NationDropdown onSelect={setGuess} />
        </div>
        <div className="relative z-0">
          <StreetView />
        </div>
      </div>

      <Button
        type="submit"
        variant="contained"
        className="save-modal-button"
        onClick={() => { if (imageUrl) { onSave(imageUrl, trueLocation, guess!); } }}
        sx={{ mt: 3, mb: 2 }}
      >
        GUESS
      </Button>
    </>

  )

}


//Create a correct image URL - Show distance between guess and correct country in an image with markers
function getDistanceImageUrl(answer: Nation, guess: Nation) {

  const center = findCenter(answer, guess)
  const centerCoordString = `${center.lat},${center.lng}`
  const answerCoordString = `${answer.lat},${answer.lng}`
  const guessCoordString = `${guess.lat},${guess.lng}`

  if (answer === guess) {

    const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerCoordString}&zoom=2&size=600x670&maptype=roadmap%20&markers=color:green%7C${answerCoordString}&key=${api_Key}`
    return imgUrl;

  }

  const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerCoordString}&zoom=2&size=600x670&maptype=roadmap%20&markers=color:green%7C${answerCoordString}&markers=color:red%7C${guessCoordString}&path=color:red|weight:5|${answerCoordString}|${guessCoordString}&key=${api_Key}`
  return imgUrl
}

//final image render component. Returns a image showing distance from guess to the correct country
const PostInFeed = ({ image, distance, guessCountryName, correctCountryName }: { image: string, distance: number, guessCountryName: string, correctCountryName: string }) => {

  if (guessCountryName === correctCountryName) {

    return (<>

      <div className="relative flex flex-col h-3/4 justify-items-center">
        <img className=" z-0 rounded-2xl h-3/4 inset-x-0  w-full relative" src={image} />
        <div className=" absolute inset-x-0 bottom-0 mb-4 z-50 mx-6  p-6 bg-white border border-gray-200 rounded-2xl shadow ">
          <Typography variant="h6" align='center' component="div" color="black">
            Correct!
          </Typography>
          <Typography variant="subtitle1" align='center' color="black">
            Great Job! You picked the correct country,  <strong>{correctCountryName}!</strong>
          </Typography>
        </div>
      </div>

    </>)

  }

  return (<>
    <div className="relative flex flex-col h-3/4 justify-items-center">
      <img className=" z-0 rounded-2xl md:h-3/4 inset-x-0  w-full relative" src={image} />
      <div className=" absolute inset-x-0 bottom-0 mb-4 z-50 mx-6  flex flex-col size-auto p-6 bg-white border border-gray-200 rounded-2xl shadow ">
        <Typography variant="h6" align='center' component="div" color="black">
          Incorrect
        </Typography>
        <Typography variant="subtitle1" align='center' color="black">
          The correct country was:  <strong>{correctCountryName}</strong>
        </Typography>
        <Typography variant="subtitle1" align='center' color="black">
          Total distance:  <strong>{distance} km ({Math.trunc(convertKmToMiles(distance))} miles)</strong>
        </Typography>
      </div>
    </div>

  </>)
}

/* ************ COMPONENT FUNCTIONS ********** */

export default class localelocatrBlock extends Block {

  render() {
    return (
      <>
        <PostInFeed image={this.model.data["imgUrl"]} distance={parseInt(this.model.data["distance"])} guessCountryName={this.model.data["guessCountryName"]} correctCountryName={this.model.data["correctCountryName"]} />
      </>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {

    const handleSave = (imgUrl: string, answer: Nation, guess: Nation) => {
      const distance = calcDist(answer, guess);
      this.model.data["imgUrl"] = imgUrl
      this.model.data["guessCountryName"] = guess.name
      this.model.data["correctCountryName"] = answer.name
      this.model.data["distance"] = distance.toString()
      done(this.model)
    }

    //resets truelocation on localelocatr open
    trueLocation = randomNation(initialWorldArray);

    return (
      <div>
        <LocaleLocatr onSave={handleSave} />
      </div>)
  }


  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}


