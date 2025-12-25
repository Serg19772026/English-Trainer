
// Removed GoogleGenAI import as it's no longer used for TTS
// import { GoogleGenAI, Modality } from "@google/genai";

// Removed decode and decodeAudioData as they are no longer needed with Web Speech API
/*
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
*/

export const speakText = async (text: string) => {
  return new Promise<void>((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('Web Speech API is not supported in this browser.'));
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;

    // Optional: Select a specific voice if available
    const voices = window.speechSynthesis.getVoices();
    const desiredVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google') || voice.lang === 'en-US'); // Prioritize Google voices if available
    if (desiredVoice) {
      utterance.voice = desiredVoice;
    } else {
      console.warn('No specific English voice found, using default.');
    }

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      reject(new Error(`TTS Error: ${event.error}`));
    };

    window.speechSynthesis.speak(utterance);
  });
};
