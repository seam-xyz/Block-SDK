import VoiceApp from './VoiceApp'
import CalligraphyApp from './CalligraphyApp'
import MoodApp from './MoodApp'
import BookshelfApp from './BookshelfApp'
import UnknownApp from './UnknownApp'
import eyesBlock from './eyesBlock'
import WhiteboardBlock from './WhiteboardBlock'
import fcUserFeedBlock from './fcUserFeedBlock'
import tokenHoldingsBlock from './tokenHoldingsBlock'
import NFTBlock from './NFTBlock'
import PhotoAlbumBlock from './PhotoAlbumBlock'
import MarqueeBlock from './MarqueeBlock'
import PokemonBlock from './PokemonBlock'
import NFTsBlock from './NFTsBlock'
import RefreshingGIFBlock from './RefreshingGIFBlock'
import PixelArtBlock from './PixelArtBlock'
import Block from './Block'
import { Theme } from "@mui/material"
import { BlockModel, BlockTypes } from './types'
import IFrameBlock from './IFrameBlock'
import TextEditBlock from './TextEditBlock'
import LinkBlock from './LinkBlock'
import ImageBlock from './ImageBlock'
import TwitterBlock from './TwitterBlock'
import TweetBlock from './TweetBlock'
import IFramelyBlock from './IFramelyBlock'
import EmptyBlock from './EmptyBlock'
import ProfileBlock from './ProfileBlock'
import GiphyBlock from './GiphyBlock'
import FlashingTextBlock from './FlashingTextBlock';
import CountdownBlock from './CountdownBlock'
import LinkBookmarkBlock from './LinkBookmarkBlock'
import VideoBlock from './VideoBlock'
import MondrianBlock from './MondrianBlock'
import WordleBlock from './WordleBlock'

export default class BlockFactory {
  static getBlock(model: BlockModel, theme: Theme): Block {
    switch (model.type) {
      case "iframe": return new IFrameBlock(model, theme)
      case "link": return new LinkBlock(model, theme)
      case "image": return new ImageBlock(model, theme)
      case "twitter": return new TwitterBlock(model, theme)
      case "text": return new TextEditBlock(model, theme)
      case "tweet": return new TweetBlock(model, theme)
      case "Link Bookmark": return new LinkBookmarkBlock(model, theme)
      case "Map": return new IFramelyBlock(model, theme)
      case "Music": return new IFramelyBlock(model, theme)
      case "video": return new VideoBlock(model, theme)
      case "profile": return new ProfileBlock(model, theme)
      case "giphy": return new GiphyBlock(model, theme)
      case "RefreshingGIF": return new RefreshingGIFBlock(model, theme)
      case "PixelArt": return new PixelArtBlock(model, theme)
      case "NFTs": return new NFTsBlock(model, theme)
      case "Pokemon": return new PokemonBlock(model, theme)
      case "Marquee": return new MarqueeBlock(model, theme)
      case "PhotoAlbum": return new PhotoAlbumBlock(model, theme)
      case "FlashingText": return new FlashingTextBlock(model, theme)
      case "tokenHoldings": return new tokenHoldingsBlock(model, theme)
      case "NFT": return new NFTBlock(model, theme)
      case "countdown": return new CountdownBlock(model, theme)
      case "fcUserFeed": return new fcUserFeedBlock(model, theme)
      case "eyes": return new eyesBlock(model, theme)
      case "Mondrian": return new MondrianBlock(model, theme)
      case "Bookshelf": return new BookshelfApp(model, theme)
      case "Wordle": return new WordleBlock(model, theme)
      case "Mood": return new MoodApp(model, theme)
      case "Whiteboard": return new WhiteboardBlock(model, theme)
      case "Voice": return new VoiceApp(model, theme)
      case "Calligraphy": return new CalligraphyApp(model, theme)
      // new blocks go here
      default: return new UnknownApp(model, theme)
    }
  }

  static getPrintableBlockName(model: BlockModel): string {
    let type = model.type
    let blockType = BlockTypes[type]
    return blockType != undefined ? BlockTypes[type].displayName : "Unknown"
  }

  static doesBlockPost(model: BlockModel): boolean {
    let type = model.type
    return BlockTypes[type].doesBlockPost
  }

  static doesBlockEditFullscreen(type: string): boolean {
    return BlockTypes[type].fullscreenEdit
  }

  static renderEmptyState(model: BlockModel, onClick: (id: string) => void): React.ReactNode {
    return (
      <EmptyBlock title={BlockFactory.getPrintableBlockName(model)} onClick={() => {
        onClick(model.uuid)
      }} />
    );
  }
}
