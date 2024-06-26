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

This file covers FR10, allowing the user to upload microphone data.
*/

let state: any = null;

let audioContext: any;
let micStreamAudioSourceNode: any;
let analyserNode: any;
let dataArray: any;
let bufferLen: any
let updates: any;
let avg: any;

async function getMicrophonePermissions() {
    if (!window.AudioContext || !window.MediaStreamAudioSourceNode || !window.AudioWorkletNode) {
      alert("Required APIs for sound level measurement not supported by this browser.");
    }
    // Chrome saves this permission and handles the querying as well.
    // Error should be handled outside of this.
    const stream = await navigator.mediaDevices
    .getUserMedia({video:false, audio:true});
    let options = {sampleRate:8000};
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      audioContext = new AudioContext();  // Firefox does not support different sample rates
    } else {
      audioContext = new AudioContext(options);
    }
    micStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  
    // Create analyser, fftSize of 64 for performance reasons
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 64;
    bufferLen = analyserNode.frequencyBinCount;
    dataArray = new Float32Array(bufferLen);
    avg = 0.0;
    updates = 0;

    // Setup network for nodes
    micStreamAudioSourceNode.connect(analyserNode);
    state = stream;

    // Start data collection, set callback to stop recording
    //audioInterval = setInterval(stopRecording, 15000);
    measureAudio();
}

// Stop user microphone from recording
async function stopRecording() {
  micStreamAudioSourceNode.disconnect();
  audioContext.close();
  state?.getTracks().forEach((track: any) => track.stop());
  state = null;
}

// Gets the average of all sound data recorded.
export function getAverage() {
  avg = avg / updates;
  var label = "Silent";
  // Set human label for how loud the area is, explicitly for display to the user.
  // https://decibelpro.app/blog/decibel-chart-of-common-sound-sources/
  if (20 < avg && avg <= 45) {
    label = "Quiet";
  } else if (45 < avg && avg <= 65) {
    label = "Moderate";
  } else if (65 < avg && avg <= 85) {
    label = "Loud";
  } else if (85 < avg) {
    label = "Very Loud";
  }
  console.log("Average:", avg, label);
  return [avg, label];
}

// This function should be called by all external files to start or stop microphone recording.
export async function toggleMicrophone() {
  if (state) {
    await stopRecording();
  } else {
    await getMicrophonePermissions();
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData
// https://stackoverflow.com/questions/40315433/analysernodes-getfloatfrequencydata-vs-getfloattimedomaindata
function measureAudio() {
  // Schedule next measure period if we want to keep recoding. Apparently scheduled by the browser.
  if (state) {
    requestAnimationFrame(measureAudio);
    analyserNode.getFloatTimeDomainData(dataArray);  // Get Pulse-Code Modulation data from microphone
    // Don't put -Infinity into average, will ruin all values
    if (dataArray[0] != -Infinity) {
      updates++;
      avg += calcRMSandDB(dataArray);
    }
  }
}

// Calculates the RMS power and dB level of the signal in the data array.
export function calcRMSandDB(data: number[]) {
  let sum = 0.0;
  // Get RMS value
  // https://community.st.com/t5/mems-sensors/is-it-possible-to-measure-sound-intensity-level-from-pcm-samples/td-p/97571
  // https://www.ncbi.nlm.nih.gov/books/NBK236684/#:~:text=In%20air%2C%20the%20common%20reference,20%20log%2020%20%3D%2026).
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  sum = Math.sqrt(sum);
  // 10dB used as a "clip" value as this is the about the sound level of breathing.
  // https://decibelpro.app/blog/decibel-chart-of-common-sound-sources/
  let db = Math.max(10, 20 * Math.log10(sum / (20 * Math.pow(10, -6))));
  return db;
}