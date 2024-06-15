// fetches a reverb impulse response when given a source url
const getReverbArrayBuffer = async (
	url: string
): Promise<ArrayBuffer | unknown> => {
	try {
		const request = await fetch(url);
		const arrayBuffer = await request.arrayBuffer();
		return arrayBuffer;
	} catch (error: unknown) {
		return error;
	}
};

// accepts an array buffer & decode's it's audio data
const convertBufferToAudioBuffer = async (
	audioCtx: AudioContext,
	arrayBuffer: ArrayBuffer
): Promise<AudioBuffer> => {
	const decoded = await audioCtx.decodeAudioData(arrayBuffer);
	return decoded;
};

const getReverbIR = async (
	audioCtx: AudioContext,
	url: string
): Promise<AudioBuffer> => {
	const arrayBuffer = (await getReverbArrayBuffer(url)) as ArrayBuffer;
	const audioBuffer = await convertBufferToAudioBuffer(audioCtx, arrayBuffer);

	// return the impulse response as an AudioBuffer
	return audioBuffer;
};

export {
  convertBufferToAudioBuffer,
	getReverbArrayBuffer,
	getReverbIR,
}
