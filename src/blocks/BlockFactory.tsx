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

export default class BlockFactory {
  static getBlock(model: BlockModel, theme: Theme): Block {
    switch (model.type) {
      case "iframe": return new IFrameBlock(model, theme)
      case "link": return new LinkBlock(model, theme)
      case "image": return new ImageBlock(model, theme)
      case "twitter": return new TwitterBlock(model, theme)
      case "text": return new TextEditBlock(model, theme)
      case "tweet": return new TweetBlock(model, theme)
      case "Map": return new IFramelyBlock(model, theme)
      case "Music": return new IFramelyBlock(model, theme)
      case "video": return new IFramelyBlock(model, theme)
      case "profile": return new ProfileBlock(model, theme)
      case "giphy": return new GiphyBlock(model, theme)
      case "RefreshingGIF": return new RefreshingGIFBlock(model, theme)
      case "PixelArt": return new PixelArtBlock(model, theme)
      case "NFTs": return new NFTsBlock(model, theme)
      case "Pokemon": return new PokemonBlock(model, theme)
      case "Marquee": return new MarqueeBlock(model, theme)
      case "PhotoAlbum": return new PhotoAlbumBlock(model, theme)
      case "FlashingText": return new FlashingTextBlock(model, theme)
      // new blocks go here
      default: return new IFrameBlock(model, theme)
    }
  }

  static getPrintableBlockName(model: BlockModel): string {
    let type = model.type
    return BlockTypes[type].displayName
  }

  static doesBlockPost(model: BlockModel): boolean {
    let type = model.type
    return BlockTypes[type].doesBlockPost
  }

  static renderEmptyState(model: BlockModel, onClick: (id: string) => void): React.ReactNode {
    return (
      <EmptyBlock title={BlockFactory.getPrintableBlockName(model)} onClick={() => {
        onClick(model.uuid)
      }} />
    );
  }
}
