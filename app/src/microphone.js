/*
References:
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs/Connect_peers/Get_microphone_permission
https://picovoice.ai/blog/how-to-record-audio-from-a-web-browser/

*/

let audioContext;
let micStreamAudioSourceNode;
let audioWorkletNode;

export async function getMicrophonePermissions() {
    if (!window.AudioContext || !window.MediaStreamAudioSourceNode || !window.AudioWorkletNode) {
      alert("Required APIs for sound level measurement not supported by this browser.");
    }
    // Chrome saves this permission and handles the querying as well.
    const stream = await navigator.mediaDevices
    //navigator.mediaDevices
    .getUserMedia({video:false, audio:true})
    //.then((stream) => {
    //  window.localStream = stream;
    //  window.localAudio.srcObject = stream;
    //  window.localAudio.autoplay = true;
    //})
    .catch((err) => {
      alert("Microphone permissions denied or closed. Please grant microphone permissions to use the microphone.");
    });

    audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("zenzone-audio-processor.js");
    micStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    audioWorkletNode = new AudioWorkletNode(audioContext, "zenzone-audio-processor");
    micStreamAudioSourceNode.connect(audioWorkletNode);
    console.log("Done")
}

export function stopRecording() {
  /*try {
    micStreamAudioSourceNode.disconnect();
    audioContext.close();
  } catch (err) {
    console.log("Error stopping microphone audio.");
  }*/
}