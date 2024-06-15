export type KeyType = "white" | "black";

export type NoteLabel =
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "A"
	| "B"
	| "C#"
	| "Db"
	| "D#"
	| "Eb"
	| "F#"
	| "Gb"
	| "G#"
	| "Ab"
	| "A#"
	| "Bb";

export interface INote {
	type: KeyType; // 'white' | 'black' | 'unknown'
	label: NoteLabel; // 'C' | 'D#' etc
	octave: number; // 0-9
	freq: number; // 00.00 OR 00.0
}

export type BaseOctave = {
	[key in NoteLabel]?: number;
};

const BASE_OCTAVE: BaseOctave = {
	C: 16.35,
	"C#": 17.32,
	D: 18.35,
	"D#": 19.45,
	E: 20.6,
	F: 21.83,
	"F#": 23.12,
	G: 24.5,
	"G#": 25.96,
	A: 27.5,
	"A#": 29.14,
	B: 30.87,
};

const generateOctave = (base: BaseOctave, octave: number): INote[] => {
	const keys = Object.keys(base);
	const notes: INote[] = [];
	keys.forEach((key) => {
		const baseVal = base[key as keyof BaseOctave] as INote["freq"];
		let octVal = baseVal;
		octVal *= octave;
		const type = key.includes("#") || key.includes("b") ? "black" : "white";
		const newNote: INote = {
			type: type as INote["type"],
			label: key as INote["label"],
			octave: octave as INote["octave"],
			freq: octVal as INote["freq"],
		};
		notes.push(newNote);
	});
	return notes;
};

const generateOctavesFromBase = (base: BaseOctave, octaveCount: number): INote[] => {
	const octList = Array.from(Array(octaveCount).keys()).filter((x) => x !== 0);
	const allNotes: INote[] = [];
	octList.forEach((octNum) => {
		const newOct = generateOctave(base, octNum);
		allNotes.push(...newOct);
	});
	return allNotes;
};

// transposes a given note frequency by 'n' steps
const transpose = (freq: number, steps: number): number => {
	return freq * Math.pow(2, steps / 12);
};
