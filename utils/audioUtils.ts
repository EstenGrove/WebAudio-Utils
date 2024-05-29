// isolated gain node (could also use audioCtx.createGain())
const createGain = (audioCtx: AudioContext, initialVol: number): GainNode => {
	const gain = new GainNode(audioCtx, {
		gain: initialVol,
	});
	return gain;
};

// Cross-browser audio context
const createAudioContext = (): AudioContext => {
	const Context = AudioContext || window.AudioContext;
	const audioCtx = new Context();
	return audioCtx;
};

// Waveforms
const createDefaultCustomWave = (audioCtx: AudioContext): PeriodicWave => {
	const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
	const cosineTerms = new Float32Array(sineTerms.length);
	return audioCtx.createPeriodicWave(cosineTerms, sineTerms);
};

export interface WaveTable {
	real: number[];
	imag: number;
}

const defaultTerms: WaveTable = {
	real: [0, 0, 1, 0, 1],
	imag: [0, 0, 1, 0, 1].length,
};

const createCustomWave = (
	audioCtx: AudioContext,
	waveTerms: WaveTable = defaultTerms
): PeriodicWave => {
	const real: Float32Array = new Float32Array(waveTerms.real);
	const imag: Float32Array = new Float32Array(waveTerms.imag);
	const customWave = audioCtx.createPeriodicWave(real, imag);

	return customWave;
};

// Note: 'base' MUST be at least 2 as that's the minimum bound for a wave
const generateCustomWave = (
	audioCtx: AudioContext,
	base: number = 4096
): PeriodicWave => {
	const real = new Float32Array(base);
	const imag = new Float32Array(base);

	for (let i = 1; i < base; i += 2) {
		imag[i] = 4.0 / (Math.PI * i);
	}

	const wave = audioCtx.createPeriodicWave(real, imag);

	return wave;
};

const createAnalyser = (audioCtx: AudioContext): AnalyserNode => {
	const analyser = new AnalyserNode(audioCtx, {
		smoothingTimeConstant: 1,
		fftSize: 2048,
	});

	return analyser;
};

const fadeOutAudio = (gainNode: GainNode, audioCtx: AudioContext) => {
	if (!gainNode) return;
	// 0.0001 is the ramp value
	// audioCtx.currentTime + 0.05 means start ramping at 5secs before end of audio
	gainNode.gain.exponentialRampToValueAtTime(
		0.0001,
		audioCtx.currentTime + 0.05
	);
};

const fadeOutOsc = (osc: OscillatorNode, time: number = 0.015) => {
	if (!osc) return;
	osc.stop(time);
};

export interface AudioChain {
	audioCtx: AudioContext;
	gainNode: GainNode;
}

// creates AudioContext & GainNode & connects them to each & output
const initAudio = (initialVol: number = 0.7): AudioChain => {
	const audioCtx = new AudioContext();
	const gainNode = audioCtx.createGain();
	gainNode.connect(audioCtx.destination);
	gainNode.gain.value = initialVol;

	return {
		audioCtx: audioCtx,
		gainNode: gainNode,
	};
};

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
	createAudioContext,
	createGain,
	createAnalyser,
	fadeOutAudio,
	fadeOutOsc,
	// Wavetables & Periodic waves
	generateCustomWave,
	createDefaultCustomWave,
	createCustomWave,
	// Reverb Utils
	convertBufferToAudioBuffer,
	getReverbArrayBuffer,
	getReverbIR,
	// Custom audio
	initAudio,
};
