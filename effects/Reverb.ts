import { Effect, IEffectInput, IEffectOutput, ISettings } from "./Effect";

export interface IReverbSettings extends ISettings {
	level: number;
	time: number;
	src: string;
}

/**
 * Reverb Class
 * - Takes a 'time' value for the time the reverb should occur
 * - Takes a 'src' value which is the impulse response (eg. reverb sample) to use
 *
 * Nodes:
 * - 'pre': this is for boosting the input signal a bit before going into the reverb node
 * - 'post': this handles makeup gains when our IR may output too low
 * - 'reverb': this is the reverb node, duh!
 *
 * NOTES:
 * - When changing the reverb node's buffer, be sure to either re-create the node or disconnect/re-connect otherwise it will play the old buffer source and cause weird bugs that glitch out
 */
class Reverb extends Effect {
	private _time!: number;
	// Impulse response source (eg. 'verb1.wav')
	private _src: string | URL;

	// Effect's input/output nodes
	private _input!: IEffectInput;
	private _output!: IEffectOutput;

	constructor(audioCtx: AudioContext, settings: ISettings) {
		super(audioCtx, settings);

		this._time = settings?.time ?? 0.5;
		this._src = settings?.src ?? "";
		// Main effect out
		this.level = settings?.level ?? 0.5;

		this.nodes = {
			reverb: this.audioCtx.createConvolver() as ConvolverNode,
			pre: this.audioCtx.createGain() as GainNode,
			post: this.audioCtx.createGain() as GainNode,
		};

		this.node = this.audioCtx.createGain() as GainNode;

		if (this._src !== "") {
			this._getImpulseResponse(this._src);
		}

		// Connect nodes
		const reverb = this.nodes.reverb as ConvolverNode;
		const pre = this.nodes.pre as GainNode;
		const post = this.nodes.post as GainNode;
		const main = this.node as GainNode;

		pre.connect(reverb);
		post.connect(main);
		reverb.connect(post);
		reverb.connect(main);
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
	public get src(): string | URL {
		return this._src;
	}
	public set src(newSrc: string | URL) {
		this._src = newSrc;
	}

	private async _getImpulseResponse(src: string | URL) {
		try {
			const request = await fetch(src);
			const arrayBuffer: ArrayBuffer = await request.arrayBuffer();
			const audioBuffer: AudioBuffer = await this.audioCtx.decodeAudioData(
				arrayBuffer,
				(decoded: AudioBuffer) => {
					const verb = this.nodes.reverb as ConvolverNode;
					verb.buffer = decoded;
					return decoded;
				}
			);
			return audioBuffer;
		} catch (error) {
			console.log("ERROR: ", error);
			return error;
		}
	}
}

export { Reverb };
