import { makeStyles, ThemeProvider } from "@mui/styles";

import Content from "./Content";
import { BlockModel } from "./blocks/types";
import "./styles.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flexGrow: 1,
  },
}));

export default function App() {
  const classes = useStyles();

  // Add your custom block here!
  // vvvvvvvvvvvvvvvvv

  let yourBlock: BlockModel = {
    type: "puffle",
    data: {},
    uuid: "test"
  }

  // End customization
  // ^^^^^^^^^^^^^^^^^

  return (
    <div className={classes.root}>
      <h1> Seam Block SDK </h1>
      <Content loadedBlocks={[yourBlock]}/>
    </div>
  );
}