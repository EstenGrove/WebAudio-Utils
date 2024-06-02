import { Effect, IEffectInput, IEffectOutput, ISettings } from "./Effect";

export interface ICompSettings extends ISettings {
	threshold?: number;
	knee?: number;
	ratio?: number;
	attack?: number;
	release?: number;
}

class Compressor extends Effect {
	private _threshold: number;
	private _knee: number;
	private _ratio: number;
	private _attack: number;
	private _release: number;
	// Input/Output sources
	private _input!: IEffectInput;
	private _output!: IEffectOutput;

	constructor(audioCtx: AudioContext, settings: ICompSettings) {
		super(audioCtx, settings);

		this.level = settings?.level ?? 0.5;
		// private/local settings
		this._knee = settings?.knee ?? 0;
		this._ratio = settings?.ratio ?? 0;
		this._attack = settings?.attack ?? 0;
		this._release = settings?.release ?? 0;
		this._threshold = settings?.threshold ?? 0;

		this.node =
			this.audioCtx.createDynamicsCompressor() as DynamicsCompressorNode;

		const compressor = this.node as DynamicsCompressorNode;
		// apply settings to node
		compressor.knee.value = this._knee;
		compressor.ratio.value = this._ratio;
		compressor.attack.value = this._attack;
		compressor.release.value = this._release;
		compressor.threshold.value = this._threshold;
	}

	// connections
	public get input(): IEffectInput {
		return this._input;
	}
	public set input(inputNode: IEffectInput) {
		this._input = inputNode;
		inputNode.connect(this.node);
	}
	public get output(): IEffectInput {
		return this._output;
	}
	public set output(outputNode: IEffectOutput) {
		this._output = outputNode;
		this.node.connect(outputNode);
	}

	// getter/setters for private values
	public set knee(newKnee: number) {
		this._knee = newKnee;
	}
	public get knee(): number {
		return this._knee;
	}

	public set ratio(newRatio: number) {
		this._ratio = newRatio;
	}
	public get ratio(): number {
		return this._ratio;
	}

	public set attack(newAttack: number) {
		this._attack = newAttack;
	}
	public get attack(): number {
		return this._attack;
	}
	public set release(newRelease: number) {
		this._release = newRelease;
	}
	public get release(): number {
		return this._release;
	}
	public set threshold(newThreshold: number) {
		this._threshold = newThreshold;
	}
	public get threshold(): number {
		return this._threshold;
	}
}

export { Compressor };
