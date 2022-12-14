# Seam Block SDK
### 🚧 This SDK is in active development. Join us along the journey! 🚧

[Seam](https://www.seam.so) is a community-developed platform to code, design, and curate your perfect social spaces. Each page is composed of blocks. We provide a testing harness, a mocked version of a card and data storage, which allows quick iteration on your block without ever touching production data.

### What are blocks?

Blocks are software Legos; they are small, re-usable components and functionality.

What do you get by creating blocks on Seam?
- Accepted blocks go like on [seam.so](https://www.seam.so) so you can add them into your profile!
- Learn to code Javascript and React. All of our blocks are open source so that you can learn from examples.

# Quickstart
| Tutorial Pt. 1      | Tutorial Pt. 2 |
| ----------- | ----------- |
| [![Block Tutorial Pt. 1](https://cdn.loom.com/sessions/thumbnails/95c436357b5b4782a4803577b4a25ad7-with-play.gif)](https://www.loom.com/embed/95c436357b5b4782a4803577b4a25ad7)      | [![Block Tutorial Pt. 2](https://cdn.loom.com/sessions/thumbnails/603a4d998c354b01bb1ac44003f5f7ef-with-play.gif)](https://www.loom.com/embed/603a4d998c354b01bb1ac44003f5f7ef)       |

1. git clone the repo, `cd Block-SDK`
2. `yarn install`
3. `./seam-magic.sh` will guide you through creating a template of an empty block, given whatever name you choose!
4. `yarn start` to see your new block in action.

### Seam Data Access

# Block Development Guide

After creating your new block using our magic script, there are only 3 functions you need to write to make your block.
- The `render()` function renders the block based on the data it has in its `BlockModel`.
- The `renderEditModal` function renders what goes inside the edit modal, which is typically a form for the user to add their customization options into. It also has a `done` function, which will call with the finished model.
- The `renderErrorState` function, which is shown whenever there is an error.

Lastly, don't forget to add your block icon to `types.tsx`! This is the icon that will show when the user is browsing the block list inside the Seam editor.

### Saving and Accessing data

Each block is given a `BlockModel` from our server, which holds a key/value store inside of its `data`. Here, you can store any string you want -- each block holds data for the card that it lives in, meaning that you don't have to worry about different users/cards when storing data.

When the block is added to a card in production, it hooks into a fully functioning data layer using the same api that was previously mocked for your local development.

### Design Systems

With Seam blocks, you don't have to start from scratch. Learn from examples of existing blocks, and in addition, we use the [Material UI system (MUI)](https://mui.com/material-ui/getting-started/overview/). Browse the docs to use common components like buttons, selectors, and more. We are in the process of deprecating the `antd` library.

### Theming

As the block developer, you decide how you want your block to reflect the global card theme. Each Seam card has a theme, which determines background color, block background color, font, and many other attributes. Themes are implemented as [`MUI Themes`](https://mui.com/material-ui/customization/theming/), which provides handy defaults and color palettes for theming components.

To use the theme, you can find it in your block at `this.theme`. The key variables you might want are as follows:

```
palette: {
    primary: {          // Card Background
      main: "#020303"
    },
    secondary: {
      main: "#1C1C1C"  // Block Background
    },
    info: {
      main: "#CCFE07"  // Accent Color
    }
  },
  typography: {
    fontFamily: "monospace"
  }
```

You can find working examples inside of the `LinkBlock.tsx` and the default theme in `App.tsx`. It is entirely optional to use the themes in your block, but it can add greater cohesion and make your block fit nicer inside of user's cards. If you don't use the theme variables, your block will have a white background by default, and it is up to you to define a font.

# Block Submission
Once you are happy with your block, it's time to create a pull request so your block can go live on the [seam.so](www.seam.so) site!

### Submission Guidelines

# Q&A
- My block needs a dependency. How should I include it?
    - Add your new package using `yarn add`, and the main Seam application will bundle it when your block is accepted
- My block needs an external API key. How do I make it work?
    - The unfortunate reality of our current walled garden internet is that much of it is gated behind API keys. Use `process.env` in your local development to insert an API key, and on block submission we'll work with you to see if it makes sense for Seam to apply for a global API key for the service you want to make a block for.
- I found a bug, and something is not working. How do I fix it?
    - The best way to file a bug is by using Github issues.
