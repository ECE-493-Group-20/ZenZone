/*
References:
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission
https://picovoice.ai/blog/how-to-record-audio-from-a-web-browser/
https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
https://www.twilio.com/en-us/blog/audio-visualisation-web-audio-api--react
*/

let state = null;

let audioContext;
let micStreamAudioSourceNode;
let audioWorkletNode;
let analyserNode;
let dataArray;
let bufferLen;
let updates;
let avgArray;
let canvas;
let canvasCtx;

async function getMicrophonePermissions() {
    if (!window.AudioContext || !window.MediaStreamAudioSourceNode || !window.AudioWorkletNode) {
      alert("Required APIs for sound level measurement not supported by this browser.");
    } /*else {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.audioContext = new audioContext();
    }*/
    // Chrome saves this permission and handles the querying as well.
    const stream = await navigator.mediaDevices
    //navigator.mediaDevices
    .getUserMedia({video:false, audio:true})
    // .then((stream) => {
    //   RNSoundLevel.start(MONITOR_INTERVAL);
    // })
    .catch((err) => {
      alert("Microphone permissions denied or closed. Please grant microphone permissions to use the microphone.");
    });
    let options = {sampleRate:8000};
    audioContext = new AudioContext(options);
    await audioContext.audioWorklet.addModule("zenzone-audio-processor.js");
    micStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  
    // Create analyser
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 32;
    bufferLen = analyserNode.frequencyBinCount;
    dataArray = new Float32Array(bufferLen);
    avgArray = new Float32Array(bufferLen);
    updates = 0;

    for (let i = 0; i < bufferLen; i++) {
      avgArray[i] = 0;
    }

    // Setup network for nodes
    micStreamAudioSourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    //audioWorkletNode = new AudioWorkletNode(audioContext, "zenzone-audio-processor");
    //micStreamAudioSourceNode.connect(audioWorkletNode);
    console.log("Done")
    state = stream;

    //https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
    /*canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);*/

    // Start data collection
    measureAudio();
}

// const getVolume = () => {
//   if (window.soundMeter && recording) {
//     let v = window.soundMeter.instant * 200;
//     setLevel(Math.min(v, 200));
//     console.log(level);
//   }
// }

function stopRecording() {
  //window.soundMeter.stop();
  micStreamAudioSourceNode.disconnect();
  audioContext.close();
  state?.getTracks().forEach(track => track.stop());
  state = null;

  // Send averaged data to server
  uploadAverage();
}

// TODO: Should be called with some set interval
function uploadAverage() {
  let serverArr = new Float32Array(bufferLen);
  for (let i = 0; i < bufferLen; i++) {
    serverArr[i] = avgArray[i] / updates;
  }
  // Make this an actual call to send data to backend
  console.log("Average!", serverArr);
}

export function toggleMicrophone() {
  if (state) {
    stopRecording();
  } else {
    getMicrophonePermissions();
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
function measureAudio() {
  // Schedule next measure period if we want to keep recoding. Apparently scheduled by the browser.
  if (state) {
    requestAnimationFrame(measureAudio);
    analyserNode.getFloatFrequencyData(dataArray);
    console.log(dataArray);
    // Don't put -Infinity into average
    if (dataArray[0] != -Infinity) {
      updates++;
      for (let i = 0; i < bufferLen; i++) {
        avgArray[i] += dataArray[i];
      }
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
    //Draw black background
    /*canvasCtx.fillStyle = "rgb(0 0 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw spectrum
    const barWidth = (canvas.width / bufferLen);
    let posX = 0;
    for (let i = 0; i < bufferLen; i++) {
      const barHeight = (dataArray[i] + 140) * 10;
      canvasCtx.fillStyle = `rgb(${Math.floor(barHeight + 100)} 50 50)`;
      canvasCtx.fillRect(
        posX,
        canvas.height - barHeight / 2,
        barWidth,
        barHeight / 2,
      );
      posX += barWidth + 1;
    }*/
  }
}