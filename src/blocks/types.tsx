import textIcon from "./blockIcons/textBlockIcon.png";
import websiteIcon from "./blockIcons/websiteIcon.png";
import videoIcon from "./blockIcons/videoIcon.png";
import imageIcon from "./blockIcons/imageIcon.png";
import linkIcon from "./blockIcons/linkIcon.png";
import twitterIcon from "./blockIcons/twitterIcon.png";
import bookmarkIcon from "./blockIcons/bookmarkIcon.png";
import mapIcon from "./blockIcons/mapIcon.png";
import giphyIcon from "./blockIcons/giphyLogo.png";
import profileIcon from "./blockIcons/profileHeaderIcon.png";
import musicIcon from "./blockIcons/musicIcon.png";
import randomGiphyIcon from "./blockIcons/randomGiphyIcon.png";
import pixelArtIcon from "./blockIcons/pixelArtIcon.png";
import nftIcon from "./blockIcons/nftIcon.png"
import pokemonIcon from "./blockIcons/pokeball.png"
import marqueeIcon from "./blockIcons/marqueeIcon.png"
import photoAlbumIcon from "./blockIcons/photoAlbumIcon.png"
import flashingTextIcon from "./blockIcons/flashingTextIcon.png";
import tokenIcon from "./blockIcons/tokenIcon.png";
import clockIcon from "./blockIcons/clockIcon.png"
import farcasterIcon from "./blockIcons/farcasterIcon.svg"
import eyesIcon from "./blockIcons/eyeIcon.png"

export type BlockModel = {
  type: string;
  data: { [key: string]: string };
  uuid: string; // must be unique to avoid layout issues
};

export type BlockType = {
  type: string;
  displayName: string; // in add block menu
  displayDescription: string; // in add block menu
  emptyTitle: string; // before configuration in card
  emptySubtitle: string; // before configuration in card
  icon: string; // in add block menu
  minHeight?: number, // in rows, each row being 5px
  minWidth?: number, // in column units
  deprecated: boolean; // if users can continue to add the block
  doesBlockPost: boolean; // do updates of this block show up in the feed?
};

// In order of how they should show up in the drop-down
export const BlockTypes: { [key: string]: BlockType } = {
  profile: {
    type: "profile",
    displayName: "Profile Header ",
    displayDescription: "Display a profile picture, title, and bio.",
    emptyTitle: "This is an empty profile header!",
    emptySubtitle: "Configure your profile header.",
    icon: profileIcon,
    deprecated: false,
    doesBlockPost: false
  },
  text: {
    type: "text",
    displayName: "Text ",
    displayDescription: "Add text with formatting and links.",
    emptyTitle: "This is an empty Text block!",
    emptySubtitle: "Add some text here.",
    icon: textIcon,
    deprecated: false,
    doesBlockPost: true
  },
  iframe: {
    type: "iframe",
    displayName: "Website ",
    displayDescription: "Embed a clickable website.",
    emptyTitle: "This is an empty IFrame block!",
    emptySubtitle: "Add a website here.",
    icon: websiteIcon,
    deprecated: false,
    doesBlockPost: false
  },
  video: {
    type: "video",
    displayName: "Video",
    displayDescription: "Add a video from Youtube, Loom, or Vimeo using a URL.",
    emptyTitle: "This is an empty video block!",
    emptySubtitle: "Add a video link here.",
    icon: videoIcon,
    deprecated: false,
    doesBlockPost: true
  },
  image: {
    type: "image",
    displayName: "Image ",
    displayDescription: "Add an image using a URL.",
    emptyTitle: "This is an empty Image block!",
    emptySubtitle: "Add an image here.",
    icon: imageIcon,
    deprecated: false,
    doesBlockPost: true
  },
  link: {
    type: "link",
    displayName: "Button ",
    displayDescription: "Create a button.",
    emptyTitle: "This is an empty button block!",
    emptySubtitle: "Add a url for the button.",
    icon: linkIcon,
    minHeight: 5,
    deprecated: false,
    doesBlockPost: true
  },
  "Link Bookmark": {
    type: "Link Bookmark",
    displayName: "Link ",
    displayDescription: "Add a link using a URL.",
    emptyTitle: "This is an empty link block!",
    emptySubtitle: "Add a url for a link.",
    icon: bookmarkIcon,
    deprecated: false,
    doesBlockPost: false
  },
  twitter: {
    type: "twitter",
    displayName: "Twitter Profile ",
    displayDescription:
      "Automatically display latest tweets from a twitter profile.",
    emptyTitle: "This is an empty Twitter feed block.",
    emptySubtitle: "Add a twitter screen name.",
    icon: twitterIcon,
    deprecated: false,
    doesBlockPost: false
  },
  tweet: {
    type: "tweet",
    displayName: "Single Tweet ",
    displayDescription: "Display a single tweet.",
    emptyTitle: "This is an empty tweet block!",
    emptySubtitle: "Add a tweet ID here.",
    icon: twitterIcon,
    deprecated: false,
    doesBlockPost: false
  },
  Music: {
    type: "Music",
    displayName: "Music ",
    displayDescription: "Embed a song or playlist from Spotify or Soundcloud.",
    emptyTitle: "This is an empty music block!",
    emptySubtitle: "Add a music link.",
    icon: musicIcon,
    deprecated: false,
    doesBlockPost: true
  },
  Map: {
    type: "Map",
    displayName: "Map ",
    displayDescription: "Display an interactive Google map.",
    emptyTitle: "This is an empty map block!",
    emptySubtitle: "Add a Google maps link.",
    icon: mapIcon,
    deprecated: false,
    doesBlockPost: true
  },
  "Image Button": {
    type: "Image Button",
    displayName: "Image Button ",
    displayDescription: "Create a button with an image background.",
    emptyTitle: "This is an empty Image button block!",
    emptySubtitle: "Add an image and url to link to.",
    icon: twitterIcon,
    deprecated: true,
    doesBlockPost: false
  },
  giphy: {
    type: "giphy",
    displayName: "GIPHY ",
    displayDescription: "Choose a gif.",
    emptyTitle: "This is an empty gif!",
    emptySubtitle: "Choose your gif.",
    icon: giphyIcon,
    deprecated: false,
    doesBlockPost: true
  },
  instagram: {
    type: "instagram",
    displayName: "Instagram ",
    displayDescription: "Embed your Instagram.",
    emptyTitle: "No Instagram here yet!",
    emptySubtitle: "Choose your Instagram.",
    icon: giphyIcon,
    deprecated: true,
    doesBlockPost: false
  },
  RefreshingGIF: {
    type: "RefreshingGIF",
    displayName: "RefreshingGIF",
    displayDescription:
      "Get a new random GIF based on your search string every load of your page",
    emptyTitle: "Empty RefreshingGIF Block",
    emptySubtitle: "Tap here to setup your RefreshingGIF block!",
    icon: randomGiphyIcon,
    deprecated: false,
    doesBlockPost: false
  },
  "PixelArt": {
    type: "PixelArt",
    displayName: "Pixel Art",
    displayDescription: "A block to make then display pixel art",
    emptyTitle: "Empty Pixel Art Block",
    emptySubtitle: "Tap here to setup your Pixel Art block!",
    icon: pixelArtIcon,
    minWidth: 2,
    deprecated: false,
    doesBlockPost: true
  },
  "NFTs": {
    type: "NFTs",
    displayName: "NFTs",
    displayDescription: "View the first twenty NFTs in your ethereum wallet.",
    emptyTitle: "Empty NFTs Block",
    emptySubtitle: "Tap here to setup your NFTs block!",
    icon: nftIcon,
    deprecated: false,
    doesBlockPost: false
  },
  "Pokemon": {
    type: "Pokemon",
    displayName: "Random Pokemon",
    displayDescription: "Displays a random Pokemon!",
    emptyTitle: "Empty PokemonBlock Block",
    emptySubtitle: "Tap here to setup your PokemonBlock block!",
    icon: pokemonIcon,
    deprecated: false,
    doesBlockPost: false
  },
  "Marquee": {
    type: "Marquee",
    displayName: "Marquee",
    displayDescription: "Displays a scrolling banner of text",
    emptyTitle: "Empty Marquee Block",
    emptySubtitle: "Tap here to setup your Marquee block!",
    icon: marqueeIcon,
    deprecated: false,
    doesBlockPost: true
  },
  "PhotoAlbum": {
    type: "PhotoAlbum",
    displayName: "Photo Album Block",
    displayDescription: "Fading photo viewer block that accepts up to 10 image URLs.",
    emptyTitle: "Empty Photo Album Block",
    emptySubtitle: "Tap here to setup your Photo Album block!",
    icon: photoAlbumIcon,
    deprecated: false,
    doesBlockPost: false
  },
  "FlashingText": {
    type: "FlashingText",
    displayName: "Flashing Text",
    displayDescription: "Text and background swap colors, creating a flashing effect.",
    emptyTitle: "Empty Flashing Text Block",
    emptySubtitle: "Tap here to setup your Flashing Text block!",
    icon: flashingTextIcon,
    deprecated: false,
    doesBlockPost: true
  },
  "countdown": {
    type: "countdown",
    displayName: "Countdown Timer",
    displayDescription: "A Countdown Timer",
    emptyTitle: "Setup Countdown Timer",
    emptySubtitle: "Tap here to setup your countdown Timer!",
    icon: clockIcon,
    deprecated: false,
    doesBlockPost: true
  },
  "tokenHoldings": {
    type: "tokenHoldings",
    displayName: "Token Holdings",
    displayDescription: "a block for displaying your ERC20 token holdings",
    emptyTitle: "Empty tokenHoldings Block",
    emptySubtitle: "Tap here to setup your tokenHoldings block!",
    icon: tokenIcon,
    deprecated: false,
    doesBlockPost: false
  },
  "NFT": {
    type: "NFT",
    displayName: "NFT",
    displayDescription: "Display a single NFT",
    emptyTitle: "Empty NFT Block",
    emptySubtitle: "Tap here to setup your NFT block!",
    icon: nftIcon,
    deprecated: false,
    doesBlockPost: false
  },
  "fcUserFeed": {
    type: "fcUserFeed",
    displayName: "Farcaster User Feed",
    displayDescription: "Top 10 most popular Farcaster casts",
    emptyTitle: "Empty Farcaster User Feed Block",
    emptySubtitle: "Tap here to setup your Farcaster User Feed block!",
    icon: farcasterIcon,
    deprecated: false,
    doesBlockPost: false
  },
  "eyes": { 
        type: "eyes",
        displayName: "eyes",
        displayDescription: "cute eyes, watching ur every move",
        emptyTitle: "Empty eyes Block",
        emptySubtitle: "Tap here to setup your eyes block!",
        icon: eyesIcon, // TODO: insert your block icon here
        deprecated: false,
        doesBlockPost: false
    },
  "puffle": { 
        type: "puffle",
        displayName: "puffle",
        displayDescription: "virtual pet",
        emptyTitle: "Empty puffle Block",
        emptySubtitle: "Tap here to setup your puffle block!",
        icon: "puffleIcon", // TODO: insert your block icon here
        deprecated: false,
        doesBlockPost: false
    },
};
