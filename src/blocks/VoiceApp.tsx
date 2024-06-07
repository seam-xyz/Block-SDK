import Block from './Block'
import { BlockModel } from './types'
import './BlockStyles.css'
import { createContext, SetStateAction, useContext, useEffect, useRef, useState, Dispatch, ReactNode } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import MicIcon from '@mui/icons-material/Mic';
import Fab from '@mui/material/Fab';

/*

  TYPES

*/

type AudioContextProps = {
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>
  mediaRecorder: React.MutableRefObject<MediaRecorder | null>
}

type AudioButtonProps = {
  onSave: (url: string) => void;
}

type PostInFeedProps = {
  url: string
}

type AudioProviderProps = {
  children: ReactNode;
}

/*

  VoiceApp DATA

*/

const defaultAudioContext = { isRecording: false, setIsRecording: () => { }, mediaRecorder: { current: null } }

const audioContext = createContext<AudioContextProps>(defaultAudioContext);

const { Provider: AudioProvider } = audioContext;

const AudioContext = ({ children }: AudioProviderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null)


  return (
    <AudioProvider value={{ isRecording, setIsRecording, mediaRecorder }}>
      {children}
    </AudioProvider>
  )

}

const start = (mediaRecorder: MediaRecorder) => {
  console.log("made it!")
  const stream = mediaRecorder.stream;
  console.log(stream)
  let audioCtx = new (window.AudioContext)();

  let realAudioInput = audioCtx.createMediaStreamSource(stream);

  let analyser = audioCtx.createAnalyser();
  analyser.smoothingTimeConstant = .9;
  realAudioInput.connect(analyser);

  // ...

  analyser.fftSize = 2048;
  let bufferLength = analyser.frequencyBinCount;
  let timeDomainData = new Uint8Array(bufferLength);
  let frequencyData = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(timeDomainData);
  analyser.getByteFrequencyData(frequencyData);

  // Get a canvas defined with ID "oscilloscope"
  let canvas = document.getElementById("oscilloscope") as HTMLCanvasElement;
  if (!canvas) return alert("The audio visualizer is missing! Reload.")
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  let canvasCtx = canvas.getContext("2d");


  // draw an oscilloscope of the current audio source
  const draw = () => {
    if (!canvasCtx) return alert("The audio visualizer is missing! Reload.")
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";

    canvasCtx.beginPath();

    let sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;

    analyser.getByteTimeDomainData(timeDomainData);

    for (let i = 0; i < bufferLength; i++) {
      let v = timeDomainData[i] / 128.0;
      let y = (v * canvas.height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    //bars
    // Affects the number of bars and their width
    let barWidth = (canvas.width / bufferLength) * 5;
    let barHeight;
    x = 0;
    analyser.getByteFrequencyData(frequencyData);

    for (let i = 0; i < bufferLength; i++) {
      // Affects the amplitude of the displayed bars (height)
      barHeight = frequencyData[i] * .5;

      canvasCtx.fillStyle = "rgb(255, 255, 255)";
      canvasCtx.fillRect(x, (canvas.height / 2) - (barHeight / 2), barWidth, barHeight);

      x += barWidth + 1;
    }

    if (mediaRecorder.state === "recording") {
      console.log("about to request")
      requestAnimationFrame(draw);
    } else {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    }

  }

  draw();
}

/*

  VoiceApp COMPONENTS

*/

// when user clicks play on the audio, it sets recording the true and the visual starts.

const PostInFeed = ({ url }: PostInFeedProps) => {
  const { mediaRecorder } = useContext(audioContext)

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder.current = new MediaRecorder(stream);
    } catch (err) {
      alert("The recorder couldn't be set up, please reload")
    }
  };

  // useEffect(() => { initializeDevice() }, [])
  initializeDevice()

  return (
    <Card style={{ backgroundColor: 'black', borderRadius: '30px' }} >
      <CardContent style={{ backgroundColor: 'black', padding: '24px', height: 240, display: 'flex', alignItems: 'center', }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', width: '100%', height: "100%",
        }}>
          <audio controls src={url} onPlay={() => {
            mediaRecorder.current?.start();
            if (mediaRecorder.current?.state === "recording") {
              start(mediaRecorder.current)
            }
      
          }} onEnded={() => {
            mediaRecorder.current?.stop(); 
            console.log(mediaRecorder.current?.state);
          }} />
          <canvas style={{ color: 'white', width: "100%", height: "100%" }} id="oscilloscope"></canvas>
        </Box>
      </CardContent>
    </Card>
  )

}

const AudioButtons = ({ onSave }: AudioButtonProps) => {
  const { isRecording, setIsRecording, mediaRecorder } = useContext(audioContext)


  const [audio, setAudio] = useState<string>("")

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder.current = new MediaRecorder(stream);
    } catch (err) {
      alert("The recorder couldn't be set up, please reload")
    }
  };

  useEffect(() => { initializeDevice() }, [])

  const toggleRecord = () => {
    if (isRecording) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setIsRecording(false);

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
      setIsRecording(true);
      start(mediaRecorder.current)
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
      <Fab onClick={toggleRecord} sx={{ width: { xs: "150px", md: "250px", lg: "250px" }, height: { xs: "150px", md: "250px", lg: "250px" } }}
        style={
          isRecording ?
            { backgroundColor: 'white', border: "5px solid black" } :
            { backgroundColor: "black" }
        }>
        <MicIcon style={isRecording ? { color: 'black', } : { color: 'white', }} />
      </Fab>
      {/* Post button */}
      <Fab sx={{
        width: { xs: "75px", md: "150px", lg: "150px" }, height: { xs: "75px", md: "150px", lg: "150px" }, color: 'white', padding: '20px'
      }} style={{
        backgroundColor: 'red'
      }} onClick={() => {
        audio === "" ? alert("Record some audio first") : handleSubmit();
      }}>
        Preview
      </Fab>

    </Box>
  )
}

const AudioCard = () => {

  return (
    <Card style={{ backgroundColor: 'black', borderRadius: '30px' }} >
      <CardContent style={{ backgroundColor: 'black', padding: '24px', height: 240, display: 'flex', alignItems: 'center', }}>
        <Box style={{
          color: 'black', backgroundColor: 'none', width: '100%', height: "100%",
        }}>
          <canvas style={{ color: 'white', width: "100%", height: "100%" }} id="oscilloscope"></canvas>
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
    return <PostInFeed url={this.model.data["audio"]} />;
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const handleSave = (audio: string) => {
      this.model.data["audio"] = audio
      done(this.model)
    }

    return (
      <AudioContext>
        <AudioCard />
        <AudioButtons onSave={handleSave} />
      </AudioContext>
    )
  }

  renderErrorState() {
    // Shouldn't have to use this anywhere because all types should be properly narrowed
    return (
      <h1>Unexpected Error, Try Reloading</h1>
    )
  }
}