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
