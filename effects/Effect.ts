
// Audio node type for mapping 'local nodes' within a class
export type TAudioNode =
	| AudioNode
	| GainNode
	| DelayNode
	| WaveShaperNode
	| BiquadFilterNode
	| OscillatorNode
	| ConvolverNode;

export interface LocalNodes {
	[key: string]: TAudioNode;
}

/**
 * 'NumericRange'
 * - Custom enumerate that accepts a range of numeric values from X to X
 * - Usage:
 * type Volume = NumericRange<0.0, 1.0>
 * - Origin: https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range
 */
export type Enumerate<
	N extends number,
	Acc extends number[] = []
> = Acc["length"] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc["length"]]>;

export type NumericRange<F extends number, T extends number> = Exclude<
	Enumerate<T>,
	Enumerate<F>
>;

export type TVolumeRange = NumericRange<0.0, 1.0>;
export type TLevel = NumericRange<0.0, 1.0>;

export interface ISettings {
	// @ts-ignore
	[key: string]: any;
}

/**
* 'IEffectInput': input source for a given Effect
* - MUST provide a signal such as an oscillator, microphone or another audio node
*/
export type IEffectInput =
	| AudioNode
	| OscillatorNode
	| GainNode
	| MediaStreamAudioSourceNode;
/**
* 'IEffectOutput': ouput source for a given Effect
* - May be a gain node, another audio node or even the main output such as 'audioContext.destination'
*/
export type IEffectOutput =
	| AudioNode
	| OscillatorNode
	| GainNode
	| MediaStreamAudioSourceNode;

/**
 * 'Effect' Class - Primitive
 * @description - This class is the primitive audio effect class to be extended by actual effect classes like "class Filter extends Effect..."
 * @param {AudioContext} audioCtx - Required audio context
 * @param {ISettings} initialSettings - Default settings to be applied
 */
class Effect {
	private _audioCtx: AudioContext;
	private _node!: AudioNode;
	// Main level control - Accessible in all classes that extend Effect
	public level!: TLevel; // range
	// Object/map of settings stored
	private _settings: ISettings;

	// nodes map
	public nodes: LocalNodes = {};

	constructor(audioCtx: AudioContext, initialSettings?: ISettings) {
		this._audioCtx = audioCtx;
		this._settings = initialSettings || {};
		this.level = 0.5 as TLevel;

		// Place any effect specific nodes here like wet/dry etc
		this.nodes = {};

		// Main Effect (FX) Out
		this.node = this.audioCtx.createGain() as GainNode;
		// Add Main out to private variable
		this._node = this.node;
		// Store in variables for typing
		const gain = this.node as GainNode;
		const gainPriv = this._node as GainNode;

		// Set initial level(s)
		gain.gain.value = this.level;
		gainPriv.gain.value = this.level;
	}

	getLevel(): TLevel | number {
		return this.level;
	}
	setLevel(newLevel: TLevel) {
		this.level = newLevel;
	}

	public updateSettings(newSettings: ISettings) {
		this._settings = newSettings;
	}
	public updateSetting(name: string, value: string | number) {
		if (name in this._settings) {
			this._settings[name] = value;
		} else {
			console.info(`That setting was not found: ${name}`);
		}
	}
	public get audioCtx(): AudioContext {
		return this._audioCtx;
	}
	public set audioCtx(ctx: AudioContext) {
		this._audioCtx = ctx;
	}
	public get node(): AudioNode {
		return this._node;
		// return this.node;
	}
	public set node(node: AudioNode) {
		this._node = node;
		// this.node = node;
	}
	public connect(node: AudioNode): AudioNode {
		this._node.connect(node);
		return this._node;
	}
	public disconnect(): AudioNode {
		this._node.disconnect();
		return this._node;
	}
	// Disconnects ALL nodes within this.nodes map
	public disconnectAll(): void {
		const nodeKeys = Object.keys(this.nodes);
		// if we have nodes in this.nodes, disconnect them
		if (nodeKeys?.length > 0) {
			nodeKeys.forEach((key) => {
				const node = this.nodes[key];
				node.disconnect();
			});
		}
	}
	public destroy(): AudioNode {
		return this.disconnect();
	}
}

export { Effect };
