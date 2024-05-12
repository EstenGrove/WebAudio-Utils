import { Effect, IEffectInput, IEffectOutput, ISettings } from "./Effect";

class VCO extends Effect {
	private _freq: number;
	private _semitones: number;
	// Input/Output
	private _input: IEffectInput;
	private _output: IEffectOutput;

	constructor(audioCtx: AudioContext, settings: ISettings) {
		super(audioCtx, settings);

		this.audioCtx = audioCtx;
		this._freq = settings.freq ?? 440.0;
		this._semitones = settings?.semitones ?? 4;

		this.nodes = {
			vco1: this.audioCtx.createOscillator() as OscillatorNode,
			vco2: this.audioCtx.createOscillator() as OscillatorNode,
			vca: this.audioCtx.createGain() as GainNode,
		};

		const vco1 = this.nodes.vco1 as OscillatorNode;
		const vco2 = this.nodes.vco2 as OscillatorNode;
		const vca = this.nodes.vca as GainNode;
		// Apply settings to VCOs
		vco1.frequency.value = this._freq;
		// Set frequency to a transposed frequency of vco1
		vco2.frequency.value = this._transpose(this._freq, this._semitones);
		// connect VCO(s) to VCA (gain)
		vco1.connect(vca);
		vco2.connect(vca);

		// Set main effect out
		this.node = vca;
	}

	public get input(): IEffectInput {
		return this._input;
	}
	public set input(inputNode: IEffectInput) {
		this._input = inputNode;
		inputNode.connect(this.node);
	}

	public get output(): IEffectOutput {
		return this._output;
	}
	public set output(outputNode: IEffectOutput) {
		this._output = outputNode;
		this.node.connect(outputNode);
	}

	public get freq(): number {
		return this._freq;
	}
	public set freq(newFreq: number) {
		this._freq = newFreq;
	}
	public get semitones(): number {
		return this._semitones;
	}
	public set semitones(newSemitones: number) {
		this._semitones = newSemitones;
	}

	private _transpose(freq: number, steps: number): number {
		const stepped = freq * Math.pow(2, steps / 12);
		return stepped;
	}
}

export { VCO };
