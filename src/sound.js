
import Tone from 'tone'

const synth = new Tone.Synth({
  oscillator: {
    type: 'sine',
    modulationType: 'sine'
  }
}).toMaster()

export const playNote = (note, time, gain) => {
  if (gain === 0) return
  const r = 440 * Math.pow(2, (19 + (64 * note) - 69) / 12)
  synth.triggerAttackRelease(r, 0.2, time, gain)
}

export const start = () => {
  synth.play()
}

export const stop = () => {
  synth.stop()
}

export default {
  playNote,
  start,
  stop
}
