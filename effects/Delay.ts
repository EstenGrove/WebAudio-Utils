import { Effect, IEffectInput, IEffectOutput, ISettings } from "./Effect";

export interface IDelaySettings extends ISettings {
	delayTime: number;
	feedback: number;
}

class Delay extends Effect {
	// Duration of delay effect
	private _delayTime: number; // 0.4 => 400ms & 0.04 => 40ms
	// Feedback tail of delay effect
	private _feedback: number; // 0.3 => 30% feedback (eg. 100% is infinite)
	// Effect's input node
	private _input!: IEffectInput;
	private _output!: IEffectOutput;

	constructor(audioCtx: AudioContext, settings: IDelaySettings) {
		super(audioCtx, settings);

		this._delayTime = settings?.delayTime ?? 0.5;
		this._feedback = settings?.feedback ?? 0.3;
		// Main effect level for this.node (the Main FX Out)
		this.level = settings?.level ?? 0.5;
		// this.input = settings?.input as IEffectInput;

		this.nodes = {
			delay: this.audioCtx.createDelay() as DelayNode,
			feedback: this.audioCtx.createGain() as GainNode,
		};

		// Main out for effect
		this.node = this.audioCtx.createGain() as GainNode;

		// Apply settings
		const delay = this.nodes.delay as DelayNode;
		const feedback = this.nodes.feedback as GainNode;
		const main = this.node as GainNode;

		// Apply settings
		main.gain.value = this.level;
		delay.delayTime.value = this._delayTime;
		feedback.gain.value = this._feedback;
		// connect to feedback
		delay.connect(feedback);
		feedback.connect(delay);
		delay.connect(main);
	}

	public get input() {
		return this._input;
	}
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

	public get delayTime(): number {
		return this._delayTime;
	}
	public set delayTime(time: number | string) {
		const num = Number(time);
		this._delayTime = num;
		// apply change to node
		const delay = this.nodes.delay as DelayNode;
		delay.delayTime.value = this._delayTime;
	}
	public get feedback(): number {
		return this._delayTime;
	}
	public set feedback(time: number | string) {
		const num = Number(time);
		this._delayTime = num;
		// apply change to node
		const delay = this.nodes.delay as DelayNode;
		delay.delayTime.value = this._delayTime;
	}
}

export interface DelayPreset {
	duration: number; // time in ms (eg. .4 => 400ms) OR (eg. 0.04 => 40ms)
	feedback: number; // as a percentagge
	level?: number;
}

export interface DelayPresets {
	[key: string]: DelayPreset;
}

/**
 * NOTE: 'feedback' typically needs to be above .3 (eg. 30%) to prevent fast artifacts of the note & delay playing in-tandem with too little time between them
 */
const delayPresets: DelayPresets = {
	pingPong: {
		duration: 0.03, // 30ms
		feedback: 0.4, // 40%
	},
	echos: {
		duration: 0.16, // 160ms
		feedback: 0.65, // 65%
	},
	metalTail: {
		level: 0.03,
		duration: 0.11,
		feedback: 0.86,
	},
};

export { Delay, delayPresets };
