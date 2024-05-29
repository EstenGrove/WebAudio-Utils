import {
	Effect,
	IEffectInput,
	IEffectOutput,
	ISettings,
	TLevel,
} from "./Effect";

export interface IEnvelopeSettings extends ISettings {
	multiplier?: number;
	// ADSR
	attack: number;
	decay?: number;
	sustain?: number;
	release?: number;
}

class EnvelopeFilter extends Effect {
	// Scale multiplier (eg. currentTime * multiplier)
	private _multiplier: number;
	// ADSR settings
	private _attack: number;
	private _decay: number;
	private _sustain: number;
	private _release: number;
	// Input/Output sources
	private _input!: IEffectInput;
	private _output!: IEffectOutput;

	constructor(audioCtx: AudioContext, settings: IEnvelopeSettings) {
		super(audioCtx, settings);

		this.level = (settings?.level ?? 0.5) as TLevel;
		this._multiplier = settings?.multiplier ?? 2.0;
		// Envelope settings
		this._attack = settings?.attack ?? 0.8;
		this._decay = settings?.decay ?? 0.0;
		this._sustain = settings?.sustain ?? 0.0;
		this._release = settings?.release ?? 0.0;

		this.nodes = {};

		// Main effect out
		const main = this.node as GainNode;

		// Calculate 'real' attack: attack * multiplier
		const attack: number = this._attack * this._multiplier;

		// Apply settings to main node
		main.gain.value = this.level;
		main.gain.setValueAtTime(0, audioCtx.currentTime);
		// Attack
		main.gain.linearRampToValueAtTime(
			this.level,
			audioCtx.currentTime + attack
		);
		// Sustain
		main.gain.setTargetAtTime(
			this._sustain * this.level,
			audioCtx.currentTime + attack,
			this._decay
		);
	}

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

	public get multiplier(): number {
		return this._multiplier;
	}
	public set multiplier(scale: number | string) {
		const num = Number(scale);
		this._multiplier = num;
	}
	public get attack(): number {
		return this._attack;
	}
	public set attack(attackLvl: number) {
		this._attack = attackLvl;
		const attack = attackLvl * this._multiplier;

		const main = this.node as GainNode;
		// Apply 'real' attack to gain node
		main.gain.linearRampToValueAtTime(
			this.level,
			this.audioCtx.currentTime + attack
		);
	}
	public get decay(): number {
		return this._decay;
	}
	public set decay(decayLvl: number) {
		this._decay = decayLvl;
		// ##TODOS:
		// - Apply to this.node gain node
	}
	public get sustain(): number {
		return this._sustain;
	}
	public set sustain(sustainLvl: number) {
		this._sustain = sustainLvl;
		const main = this.node as GainNode;
		// Apply sustain to node
		main.gain.setTargetAtTime(
			this._sustain * this.level,
			this.audioCtx.currentTime + this._attack,
			this._decay
		);
	}
	public get release(): number {
		return this._release;
	}
	public set release(releaseLvl: number) {
		this._release = releaseLvl;
		// ##TODOS:
		// - Apply release to this.node gain node
	}
}

export { EnvelopeFilter };
