# Various Web Audio Utils For React


## Usage Examples

```tsx
const Demo = () => {
  const synth = useKeyboardSynth();
  const [activeFreqs, setActiveFreqs] = useState<number[]>([]);

  const getActiveFrequencies = useCallback(() => {
    const activeOscs = synth?.activeOscillators ?? {};
    const oscKeys = Object.keys(activeOscs);
    const freqs: number[] = [];
    if(oscKeys?.length > 0) {
      oscKeys.forEach(key => {
        const osc = activeOscs[key] as OscillatorNode;
        const freq = osc.frequency;
        freqs.push(freq);
      })
    }
    setActiveFreqs(freqs);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if(!isMounted) return;

    if(synth.activeOscillators) {
      getActiveFrequencies()
    }

    return () => {
      isMounted = false;
    }
  }, [synth.activeOscillators])
  
  return (
    <div>
      <h1>Synth Hook Demo</h1>
      <p>Press any key on your keyboard to play a note</p>
      <p>You can even play multiple notes simultaneously or chords.</p>
      <p>Notice that each note has a transposed version applied to create more "depth" for a richer sound</p>
      <h4>Currently Playing Frequencies</h4>
      <ul>
        {activeFreqs && activeFreqs?.length > 0 && activeFreqs?.map((freq, idx) => (
          <li key={`${idx}-${freq}`}>
            {freq}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
