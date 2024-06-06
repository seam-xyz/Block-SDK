import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import MicIcon from '@mui/icons-material/Mic';
import Fab from '@mui/material/Fab';

/*

  TYPES

*/

type AudioButtonProps = {
  onSave: (url: string) => void;
}

type PostInFeedProps = {
  url: string
}

/*

  VoiceApp DATA

*/

const useAudioData = () => {
  const [audio, setAudio] = useState<string>("")
  return { audio, setAudio }
}

/*

  VoiceApp COMPONENTS

*/

const PostInFeed = ({url}: PostInFeedProps) => {
  console.log("post in feed url", url)
  return (
    <audio controls src={url} />
  )
}

const AudioButtons = ({ onSave }: AudioButtonProps) => {
  const { audio, setAudio } = useAudioData()

  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [chunks, setChunks] = useState<any>([]);

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder.current = new MediaRecorder(stream);
    } catch (err) {
      console.log(err, "couldn't initialize recorder");
    }
  };

  useEffect(() => { initializeDevice() }, [])

  const toggleRecord = () => {
    if (isRecording) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop() 
        console.log(mediaRecorder.current.state);
        setIsRecording(false)

        mediaRecorder.current.ondataavailable = (e) => {
          const blob = new Blob([e.data], { type: "audio/webm;codecs=opus" });
            const audioURL = URL.createObjectURL(blob);
            setAudio(audioURL)
        };

        return
      }
    }
    
    if (mediaRecorder.current) {
      mediaRecorder.current.start()
      console.log(mediaRecorder.current.state);
      setIsRecording(true);
    }
  }

  const handleSubmit = () => {
    onSave(audio)
  }

  return (
    <Box style={{
      backgroundColor: 'none', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', width: '100%'
    }} >
      {/* Microphone button */}
      <Fab onClick={toggleRecord} sx={{ width: { xs: "150px", md: "250px", lg: "250px" }, height: { xs: "150px", md: "250px", lg: "250px" } }} style={{
        backgroundColor: 'black'
      }}>
        <MicIcon style={{
          borderRadius: '50%',
          color: 'white',
        }} />
      </Fab>
      {/* Post button */}
      <Fab sx={{
        width: { xs: "75px", md: "150px", lg: "150px" }, height: { xs: "75px", md: "150px", lg: "150px" }, color: 'white', padding: '20px'
      }} style={{
        backgroundColor: 'red'
      }} onClick={handleSubmit}>
        Post
      </Fab>

    </Box>
  )
}

const AudioCard = () => {
  return (
    <Card style={{ backgroundColor: 'black', borderRadius: '30px' }} >

      <CardContent style={{ backgroundColor: 'black', padding: '24px', height: 240, display: 'flex', alignItems: 'center', }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', display: 'flex', justifyContent: 'space-between', width: '100%'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <DeleteOutlineIcon style={{ color: 'black', backgroundColor: 'white', borderRadius: '50px' }} />
            <span style={{ color: 'white' }}>0.00</span>
          </div>
          <span style={{ color: 'white' }}>
            .....<GraphicEqIcon />.....
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
            < PlayCircleIcon style={{ color: 'white', backgroundColor: 'transparent', borderRadius: '50px' }} />
            <span style={{ color: 'white' }}>0.00</span>

          </div>
        </Box>
      </CardContent>

    </Card>
  )
}

/* 

  SEAM CLASS

*/

export default class VoiceBlock extends Block {

  render() {
    console.log(this.model.data["audio"])
    return <PostInFeed url={this.model.data["audio"]} />;
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const handleSave = (audio: string) => {
      this.model.data["audio"] = audio
      done(this.model)
    }

    return (
      <>
        <AudioCard />
        <AudioButtons onSave={handleSave} />
      </>

    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}


  // const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  // const [recording, setRecording] = useState<boolean>(false)
  // // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>()
  // let mediaRecorder: MediaRecorder | null = null

  // const startRecording = () => {
  //   navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  //     mediaRecorder = new MediaRecorder(stream)
  //     mediaRecorder.start();
  //     setRecording(!recording)
  //     console.log(mediaRecorder.state);
  //   });
  // }

  // const stopRecording = () => {
  //   if (mediaRecorder?.state == "recording") {
  //     mediaRecorder.stop();
  //     setRecording(!recording)
  //     console.log(mediaRecorder?.state);

  //     mediaRecorder.ondataavailable = (e) => {
  //       setAudioChunks([...audioChunks, e.data])
  //     };

  //     mediaRecorder.onstop = () => {
  //       const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  //       const url = URL.createObjectURL(audioBlob);
  //       setAudio(url);
  //       setAudioChunks([])
  //     };
  //   } else {
  //     console.log("No active recording to stop");
  //   }
  // }

  // const toggleRecord = () => {
  //   if (recording) {
  //     stopRecording();
  //     return;
  //   };
  //   startRecording()
  // }