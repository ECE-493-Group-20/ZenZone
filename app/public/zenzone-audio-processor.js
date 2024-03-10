/*
Note: Had to be a JavaScript file as this specific class extension returned an error in TypeScript.

References:

https://picovoice.ai/blog/how-to-record-audio-from-a-web-browser/

Has to be located in the "public" folder, see:
https://hackernoon.com/implementing-audioworklets-with-react-8a80a470474
https://stackoverflow.com/questions/49972336/audioworklet-error-domexception-the-user-aborted-a-request
*/
class ZenZoneAudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        // Get input for first channel
        const inputData = inputs[0][0];

        console.log(inputData);

        return true;
    }
}

registerProcessor('zenzone-audio-processor', ZenZoneAudioProcessor);
console.log("zenzone-audio-processor registered.");
alert("Audio processor");