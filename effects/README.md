# Usage Examples of the 'Effect' Class & Extended Classes


## Using the 'Delay' Class

<details>
  <summary>Delay Class Usage</summary>

```tsx
// Create global variables: volume, ctx and master out
let volume: number = 0.7;
let freq: number = 440.0;
const audioCtx: AudioContext = new AudioContext();
const master: GainNode = new GainNode(audioCtx, {
  gain: volume
});


// Our input source will be an oscillator
const osc = new OscillatorNode(audioCtx, {
  frequency: freq
});
const delay = new Delay(audioCtx, {
  level: 0.5,
  delayTime: 0.6,
  feedback: 0.7
});

// Set the input/output for the delay node
delay.input = osc;
delay.output = master;

// connect osc to master & send to output
osc.connect(master);
master.connect(audioCtx.destination);

// play the osc when a user clicks some button
// ...below is inside an event listener

// Start the osc & stop the osc in 0.25 seconds
osc.start(audioCtx.currentTime);
osc.stop(audioCtx.currentTime + 0.25)
```
  
</details>

-------------------------------------------------------

## Using the 'Filter' Class
Using the `Filter` effect class to apply frequency filtering, boosting and/or attenuating.

<details>
  <summary>Filter Class Usage</summary>

```tsx

const filter = new Filter(audioCtx, {
			freq: 5000,
			type: "highpass",
			q: 20,
			gain: 5,
		});

		const osc: OscillatorNode = new OscillatorNode(audioCtx, {
			type: "square",
			frequency: noteFreq,
		});
		const osc2: OscillatorNode = new OscillatorNode(audioCtx, {
			type: "square",
			frequency: transpose(noteFreq, 12),
		});

    // connect oscillators to filter node
    // connect filter node to our output (device speakers)
		osc.connect(filter.node);
		osc2.connect(filter.node);
		filter.connect(audioCtx.destination);
		osc.start();
		osc2.start();
```

</details
