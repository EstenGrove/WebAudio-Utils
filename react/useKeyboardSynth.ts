import { useRef, useEffect } from "react";
import { transpose } from "../utils/utils_notes";
// REQUIREMENTS:
// - Audio Context
// - Volume Level (gain)

export interface IActiveOscs {
	[key: string]: OscillatorNode;
}

export interface IKeyMap {
	[code: string]: number;
}

const defaultKeyMap: IKeyMap = {
	KeyA: 65.41,
	KeyS: 69.3,
	KeyD: 73.42,
	KeyF: 77.78,
	KeyG: 82.41,
	KeyH: 87.31,
	KeyJ: 92.5,
	KeyK: 98,
	KeyL: 103.83,
	Semicolon: 110,
	Quote: 116.54,
	// extra rows
	KeyQ: 116.54,
	KeyW: 123.47,
	// Octave 4
	KeyE: 130.81,
	KeyR: 138.59,
	KeyT: 146.83,
	KeyY: 155.56,
	KeyU: 164.81,
	KeyI: 174.61,
	KeyO: 185,
	KeyP: 196,
	KeyZ: 207.65,
	KeyX: 220,
	KeyC: 233.08,
	KeyV: 246.94,
	KeyB: 261.63,
	KeyN: 277.18,
	KeyM: 293.66,
};

type KeySynthProps = {
	keyMap?: IKeyMap;
};

interface KeySynthReturn {
	audioCtx: AudioContext;
	activeOscillators: IActiveOscs;
	playNotes: (noteFreq: number) => PlayReturn;
}

export interface PlayReturn {
	osc1: OscillatorNode;
	osc2: OscillatorNode;
}

let audioCtx: AudioContext;

const useKeyboardSynth = ({
	keyMap = defaultKeyMap,
}: KeySynthProps = {}): KeySynthReturn => {
	const localOscs = useRef<IActiveOscs>({});

	const handleKeyDown = (e: KeyboardEvent): void => {
		if (e.repeat) return;
		if (!audioCtx) {
			audioCtx = new AudioContext();
		}

		const code = e.code;
		const activeOsc = localOscs.current;
		const noteFreq: number = keyMap[code as keyof object];

		// have to check, that the osc key code DOES NOT ALREADY EXIST
		if (noteFreq && (!activeOsc[code] || !activeOsc[`${code}_2`])) {
			const { osc1, osc2 } = playNotes(noteFreq);

			activeOsc[code] = osc1;
			activeOsc[`${code}_2`] = osc2;
		}
	};

	const handleKeyUp = (e: KeyboardEvent): void => {
		if (e.repeat) return;

		const code = e.code;
		const activeOsc = localOscs.current;

		if (activeOsc[code]) {
			const osc = activeOsc[code] as OscillatorNode;
			const osc2 = activeOsc[`${code}_2`] as OscillatorNode;
			osc.stop();
			osc2.stop();
			osc.disconnect();
			osc2.disconnect();
			delete activeOsc[code];
			delete activeOsc[`${code}_2`];
		}
	};

	// plays 2 oscillators simulataneously (base & transposed)
	const playNotes = (noteFreq: number): PlayReturn => {
		const osc: OscillatorNode = new OscillatorNode(audioCtx, {
			type: "square",
			frequency: noteFreq,
		});
		const osc2: OscillatorNode = new OscillatorNode(audioCtx, {
			type: "square",
			frequency: transpose(noteFreq, 12),
		});

		osc.connect(audioCtx.destination);
		osc2.connect(audioCtx.destination);
		osc.start();
		osc2.start();

		return {
			osc1: osc,
			osc2: osc2,
		};
	};

	// add event listeners
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			isMounted = false;
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		audioCtx: audioCtx,
		activeOscillators: localOscs?.current,
		playNotes: playNotes,
	};
};

export { useKeyboardSynth };
