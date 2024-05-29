import { getReverbIR } from "../../utils/utils_audio";
import { Effect, IEffectInput, IEffectOutput, ISettings } from "./Effect";

export interface IReverbSettings extends ISettings {
	time: number;
	src: string;
	wet?: number;
	dry?: number;
}

/**
 * Reverb Class
 * - Takes a 'time' value for the time the reverb should occur
 * - Takes a 'src' value which is the impulse response (eg. reverb sample) to use
 *
 * Nodes:
 * - 'dry': this is for boosting the input signal a bit before going into the reverb node
 * - 'wet': this handles makeup gains when our IR may output too low
 * - 'reverb': this is the reverb node, duh!
 *
 * NOTES:
 * - When changing the reverb node's buffer, be sure to either re-create the node or disconnect/re-connect otherwise it will play the old buffer source and cause weird bugs that glitch out
 */
class Reverb extends Effect {
	private _time!: number;
	// Impulse response source (eg. 'verb1.wav')
	private _src: string;
	private _bufferIR: AudioBuffer;
	private _wetLevel: number;
	private _dryLevel: number;

	// Effect's input/output nodes
	private _input!: IEffectInput;
	private _output!: IEffectOutput;

	constructor(audioCtx: AudioContext, settings: IReverbSettings) {
		super(audioCtx, settings);

		this._time = settings?.time ?? 0.5;
		this._src = settings?.src ?? "";
		// Main effect out
		this.level = settings?.level ?? 0.7;
		this._dryLevel = settings?.dry ?? 0.5;
		this._wetLevel = settings?.wet ?? 0.7;

		this.nodes = {
			dry: this.audioCtx.createGain() as GainNode,
			wet: this.audioCtx.createGain() as GainNode,
		};

		// main reverb node
		this.node = this.audioCtx.createConvolver() as ConvolverNode;

		// if we have a 'src', then fetch the impulse response
		// ...and save to 'this._bufferIR'
		if (this._src !== "") {
			this._getImpulseResponse(this._src);
		}

		// Connect nodes
		const reverb = this.node as ConvolverNode;
		const dry = this.nodes.dry as GainNode;
		const wet = this.nodes.wet as GainNode;

		reverb.connect(wet);
		dry.connect(audioCtx.destination);
		wet.connect(audioCtx.destination);
		wet.gain.value = this.level;
	}

	public get input() {
		return this._input;
	}
	public set input(inputNode: IEffectInput) {
		this._input = inputNode;
		inputNode.connect(this.nodes.reverb);
	}
	public get output(): IEffectOutput {
		return this._output;
	}
	public set output(outputNode: IEffectOutput) {
		this._output = outputNode;
		this.node.connect(outputNode);
	}

	public get time(): number {
		return this._time;
	}
	public set time(newTime: number) {
		this._time = newTime;
	}
	public get src(): string {
		return this._src;
	}
	public set src(newSrc: string) {
		this._src = newSrc;
	}

	private async _getImpulseResponse(src: string) {
		const reverbIR = await getReverbIR(this.audioCtx, src);
		const reverb = this.node as ConvolverNode;

		this._bufferIR = reverbIR;
		reverb.buffer = reverbIR;
	}
}

export { Reverb };
