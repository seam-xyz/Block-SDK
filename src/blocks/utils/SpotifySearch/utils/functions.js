import axios from 'axios';

export const getParamValues = (url) => {
  return url
    .slice(1)
    .split('&')
    .reduce((prev, curr) => {
      const [title, value] = curr.split('=');
      prev[title] = value;
      return prev;
    }, {});
};

const getAuth = async () => {
  var currentURL = window.location.protocol + '//' + window.location.host; // use this to avoid cors on dev and preview deployments
  if (currentURL == "capacitor://localhost") { currentURL = "https://www.seam.so" };
  const apiURL = currentURL + "/api/spotifySearch?id=" + process.env.REACT_APP_SPOTIFY_CLIENT_ID
  var tokenResponse = ''
  try {
    tokenResponse = await fetch(apiURL)
  } catch (error) {
    // TypeError: Failed to fetch
    console.log('There was an error', error);
  }
  const tokenJSON = await tokenResponse.json()
  const token = tokenJSON["token"]
  return token
}

export const setAuthHeader = async () => {
  try {
    const accessToken = await getAuth()
    if (accessToken) {
      axios.defaults.baseURL = 'https://www.seam.so';
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${accessToken}`;
    }
  } catch (error) {
    console.log('Error setting auth', error);
  }
};
