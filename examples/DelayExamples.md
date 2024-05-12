# Examples of Using Delay
Most of these examples are likely to be using React as it's much faster experience for building quick demos.


## Generic Delay Effect w/ an Oscillator
Includes controls for:
- `duration`: time of delay
- `feedback`: percent of feedback to apply (determines the length of repeats)

### Delay Playground

```tsx
import { ChangeEvent, useRef, useState } from "react";
import styles from "../../css/playground/DelayPlayground.module.scss";
import RangeInput from "../shared/RangeInput";
import { initAudio } from "../../utils/utils_audio";
import { Delay } from "../../audio/effects/Delay";
import { IKeyNote, getRandomKeyNote } from "../../audio/notes/notes";

let audioCtx: AudioContext;
let masterOut: GainNode;
const volume: number = 0.7;
const frequency = 440.0;

const DelayPlayground = () => {
	const osc = useRef<OscillatorNode | null>(null);
	// delay ms
	const [duration, setDuration] = useState<string>(".5");
	// % of feedback
	const [feedback, setFeedback] = useState<string>(".3");

	const handleDuration = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setDuration(value);
	};
	const handleFeedback = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setFeedback(value);
	};

	const init = () => {
		const { audioCtx: ctx, gainNode } = initAudio(volume);

		audioCtx = ctx;
		masterOut = gainNode;
	};

  // this is a working version WITHOUT using the custom 'Delay' class...
  // and instead using the browser default DelayNode
	const playTone_WORKS = () => {
		if (!audioCtx) {
			init();
		}

		const delay = new DelayNode(audioCtx, { delayTime: Number(duration) });
		const feedbackNode = new GainNode(audioCtx, { gain: Number(feedback) });
		osc.current = new OscillatorNode(audioCtx, { frequency: frequency });
		// connect osc & delay & master
		osc.current.connect(masterOut);
		osc.current.connect(delay);
		delay.connect(masterOut);
		delay.connect(feedbackNode);
		feedbackNode.connect(delay);
		osc.current.start(audioCtx.currentTime);
		osc.current.stop(audioCtx.currentTime + 0.25);
	};

  // this example uses my custom 'Delay' class
	const playTone = () => {
		if (!audioCtx) {
			init();
		}
		// const note: IKeyNote = getRandomKeyNote();

		const delay = new Delay(audioCtx, {
			level: 0.03,
			delayTime: Number(duration),
			feedback: Number(feedback),
		});

		osc.current = new OscillatorNode(audioCtx, { frequency: frequency });
		delay.input = osc.current;
		delay.output = masterOut;
		// connect all the nodes
		osc.current.connect(masterOut);
		osc.current.start(audioCtx.currentTime);
		osc.current.stop(audioCtx.currentTime + 0.25);
	};

	const killAudio = () => {
		if (osc.current) {
			osc.current.stop(audioCtx.currentTime + 0.15);
			osc.current.disconnect();
		}
	};

	console.log("audioCtx", audioCtx);

	return (
		<div className={styles.DelayPlayground}>
			<div className={styles.DelayPlayground_actions}>
				<button type="button" onClick={playTone}>
					Play Osc
				</button>
				<button type="button" onClick={killAudio}>
					Kill Osc
				</button>
			</div>
			<div className={styles.DelayPlayground_settings}>
				<RangeInput
					key="duration"
					name="duration"
					id="duration"
					val={duration}
					min={0.0}
					max={1.0}
					step={0.01}
					label={`Duration: ${Number(duration) * 1000} ms`}
					handleChange={handleDuration}
				/>
				<RangeInput
					key="feedback"
					name="feedback"
					id="feedback"
					val={feedback}
					min={0.0}
					max={1.0}
					step={0.01}
					label={`Feedback: ${Math.round(Number(feedback) * 100)}%`}
					handleChange={handleFeedback}
				/>
			</div>
		</div>
	);
};

export default DelayPlayground;

```
