/*
References:
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission
https://picovoice.ai/blog/how-to-record-audio-from-a-web-browser/
https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
https://www.twilio.com/en-us/blog/audio-visualisation-web-audio-api--react
https://community.st.com/t5/mems-sensors/is-it-possible-to-measure-sound-intensity-level-from-pcm-samples/td-p/97571
https://www.ncbi.nlm.nih.gov/books/NBK236684/#:~:text=In%20air%2C%20the%20common%20reference,20%20log%2020%20%3D%2026).
https://stackoverflow.com/questions/40315433/analysernodes-getfloatfrequencydata-vs-getfloattimedomaindata
https://decibelpro.app/blog/decibel-chart-of-common-sound-sources/
*/

let state = null;

let audioContext;
let micStreamAudioSourceNode;
let audioWorkletNode;
let analyserNode;
let dataArray;
let bufferLen;
let updates;
let avg;
let canvas;
let canvasCtx;

async function getMicrophonePermissions() {
    if (!window.AudioContext || !window.MediaStreamAudioSourceNode || !window.AudioWorkletNode) {
      alert("Required APIs for sound level measurement not supported by this browser.");
    }
    // Chrome saves this permission and handles the querying as well.
    const stream = await navigator.mediaDevices
    //navigator.mediaDevices
    .getUserMedia({video:false, audio:true})
    .catch((err) => {
      alert("Microphone permissions denied or closed. Please grant microphone permissions to use the microphone.");
    });
    let options = {sampleRate:8000};
    audioContext = new AudioContext(options);
    micStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  
    // Create analyser
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 64;
    bufferLen = analyserNode.frequencyBinCount;
    dataArray = new Float32Array(bufferLen);
    avg = 0.0;
    updates = 0;

    // Setup network for nodes
    micStreamAudioSourceNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    state = stream;

    // Start data collection
    measureAudio();
}

function stopRecording() {
  micStreamAudioSourceNode.disconnect();
  audioContext.close();
  state?.getTracks().forEach(track => track.stop());
  state = null;
  // Send averaged data to server
  uploadAverage();
}

// TODO: Should be called with some set interval
function uploadAverage() {
  avg = avg / updates;
  // Make this an actual call to send data to backend
  console.log("Average!", avg);
}

export function toggleMicrophone() {
  if (state) {
    stopRecording();
  } else {
    getMicrophonePermissions();
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
// https://stackoverflow.com/questions/40315433/analysernodes-getfloatfrequencydata-vs-getfloattimedomaindata
function measureAudio() {
  // Schedule next measure period if we want to keep recoding. Apparently scheduled by the browser.
  if (state) {
    requestAnimationFrame(measureAudio);
    //analyserNode.getFloatFrequencyData(dataArray);
    analyserNode.getFloatTimeDomainData(dataArray);
    console.log(dataArray);
    // Don't put -Infinity into average
    if (dataArray[0] != -Infinity) {
      updates++;
      let sum = 0;
      // Get RMS value
      // https://community.st.com/t5/mems-sensors/is-it-possible-to-measure-sound-intensity-level-from-pcm-samples/td-p/97571
      // https://www.ncbi.nlm.nih.gov/books/NBK236684/#:~:text=In%20air%2C%20the%20common%20reference,20%20log%2020%20%3D%2026).
      for (let i = 0; i < bufferLen; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      sum = Math.sqrt(sum);
      // 10dB used as a "clip" value as this is the about the sound level of breathing.
      // https://decibelpro.app/blog/decibel-chart-of-common-sound-sources/
      let db = Math.max(10, 20 * Math.log10(sum / (20 * Math.pow(10, -6))));
      avg += db;
      console.log("DB level:", db);
    }
  }
}