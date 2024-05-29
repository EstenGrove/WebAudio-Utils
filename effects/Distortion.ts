import { Effect, IEffectInput, IEffectOutput, ISettings } from "./Effect";

export type IOversample = "none" | "2x" | "4x";
export interface IDistortionSettings extends ISettings {
	oversamples?: IOversample;
}

// ##TODOS:
// - Improve this._createDistCurve() as the clipping could be smoother.

class Distortion extends Effect {
	private _oversample!: IOversample;
	// Effect's input node
	private _input!: IEffectInput;
	private _output!: IEffectOutput;

	constructor(audioCtx: AudioContext, settings: IDistortionSettings) {
		super(audioCtx, settings);

		this.level = settings?.level ?? 50;
		this._oversample = settings?.oversamples ?? "4x";

		this.nodes = {
			pre: this.audioCtx.createGain() as GainNode,
			post: this.audioCtx.createGain() as GainNode,
			waveshaper: this.audioCtx.createWaveShaper() as WaveShaperNode,
		};

		this.node = this.audioCtx.createWaveShaper() as WaveShaperNode;

		const waveshaper = this.node as WaveShaperNode;
		waveshaper.curve = this._createDistCurve(this.level);
		waveshaper.oversample = this._oversample;
	}

	public get input() {
		return this._input;
	}
	// Equivalent to: <some-node>.connect(this.node)
	public set input(inputNode: IEffectInput) {
		this._input = inputNode;
		inputNode.connect(this.nodes.delay);
	}
	public get output(): IEffectOutput {
		return this._output;
	}
	public set output(outputNode: IEffectOutput) {
		this._output = outputNode;
		this.node.connect(outputNode);
	}

	// Adapted from: https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
	// Tranfergraph for testing: https://kevincennis.github.io/transfergraph/
	private _createDistCurve(level: number = 50): Float32Array {
		const DEG = Math.PI / 180;
		const samples = 44100;
		const k = level <= 400 ? level : 50;
		const curve = new Float32Array(samples);
		curve.forEach((_, i) => {
			const x = (i * 2) / samples - 1;
			curve[i] = ((3 + k) * x * 20 * DEG) / (Math.PI + k * Math.abs(x));
		});
		return curve;
	}
}

export { Distortion };
