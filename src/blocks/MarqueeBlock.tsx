import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type MarqueeProps = React.HTMLAttributes<HTMLElement>

function TypescriptMarquee(props: MarqueeProps) {
  // @ts-ignore
  return <marquee scrollamount="30" direction="left" {...props} />
}

export default class MarqueeBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let text = this.model.data['text']
    if (text === undefined) {
      return this.renderErrorState()
    }

    return (
      <TypescriptMarquee style={{fontSize: '64px'}}>
        {text}
      </TypescriptMarquee>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let text = data.get('text') as string
      this.model.data['text'] = text
      done(this.model)
    };

    return (
      <Box
        component="form"
        onSubmit={onFinish}
        style={{}}
      >
        <TextField
          margin="normal"
          required
          defaultValue={this.model.data['text']}
          fullWidth
          id="text"
          label="Text"
          name="text"
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          className="save-modal-button"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
      </Box>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}