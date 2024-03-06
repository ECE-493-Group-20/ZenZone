export function getMicrophonePermissions() {
    // Chrome saves this permission and handles the querying as well.
    navigator.mediaDevices
    .getUserMedia({video:false, audio:true})
    .catch((err) => {
      alert("Microphone permissions denied or closed. Please grant microphone permissions to use the microphone.");
    });
  }