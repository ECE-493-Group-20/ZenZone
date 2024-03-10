/*
References:
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission
https://picovoice.ai/blog/how-to-record-audio-from-a-web-browser/

*/

let state = null;

let audioContext;
let micStreamAudioSourceNode;
let audioWorkletNode;

const getMicrophonePermissions = async() => {
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
    audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("zenzone-audio-processor.js");
    micStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    audioWorkletNode = new AudioWorkletNode(audioContext, "zenzone-audio-processor");
    micStreamAudioSourceNode.connect(audioWorkletNode);
    console.log("Done")
    state = stream;
}

// const getVolume = () => {
//   if (window.soundMeter && recording) {
//     let v = window.soundMeter.instant * 200;
//     setLevel(Math.min(v, 200));
//     console.log(level);
//   }
// }

const stopRecording = () => {
  //window.soundMeter.stop();
  micStreamAudioSourceNode.disconnect();
  audioContext.close();
  state?.getTracks().forEach(track => track.stop());
  state = null;
}

export function toggleMicrophone() {
  if (state) {
    stopRecording();
  } else {
    getMicrophonePermissions();
  }
}