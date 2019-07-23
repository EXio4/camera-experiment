
import { createLowResMap } from './cameraProcess'
import { getIndex } from './imageData'
import sound from './sound'

let playing = false
// Put event listeners into place
window.addEventListener('DOMContentLoaded', function () {
  // Grab elements, create settings, etc.
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  const resultCanvas = document.getElementById('output')
  const resultContext = resultCanvas.getContext('2d')
  const linearCanvas = document.getElementById('outputLinear')
  const linearContext = linearCanvas.getContext('2d')
  const rawCanvas = document.getElementById('rawcanvas')
  const rawContext = rawCanvas.getContext('2d')
  document.getElementById('playBtn').onclick = () => {
    playing = !playing
  }
  const video = document.getElementById('video')
  const mediaConfig = {
    video: {
      advanced: [{
        facingMode: 'environment'
      }]
    }
  }

  // Put video listeners into place
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
      // video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream
      video.play()
    })
  }

  const stats = (testArray) => {
    let max = testArray[0]
    let min = testArray[0]
    let avg = 0
    for (let i = 1; i < testArray.length; ++i) {
      if (testArray[i] > max) {
        max = testArray[i]
      }
      if (testArray[i] < min) {
        min = testArray[i]
      }
      avg += testArray[i]
    }
    avg /= testArray.length
    return { min, max, avg }
  }

  const drawFrame = () => {
    rawContext.drawImage(video, 0, 0, 640, 480)
    context.drawImage(video, 0, 0, 640, 480)
    context.strokeStyle = 'white'
    context.lineWidth = 3
    context.strokeRect(80, 0, 480, 480)
    const inputImageData = rawContext.getImageData(80, 0, 480, 480)
    const outputImageData = resultContext.createImageData(inputImageData)
    const linearImageData = resultContext.createImageData(1024, 64)

    const weirdOutput = createLowResMap(inputImageData, outputImageData, {
      inputSize: 480,
      outputSize: 480,
      outputResolution: 8
    })

    const { min, max } = stats(weirdOutput.data)
    /*
                    this function will normalize to a 0-255 range, but it'll try to preserve "quietness" to avoid overblowing darkness
                */
    const normalizeMinMax = (v) => {
      const diff = Math.max(max - min, 128)
      const r = 255 * (v - min) / diff
      // let r = 4 * v - (v*v)/64
      if (isNaN(r)) return 0
      if (r >= 255) return 255
      if (r <= 0) return 0
      return r
    }
    const weirdOutputNormalized = weirdOutput.data.map(normalizeMinMax)
    const { avg } = stats(weirdOutputNormalized)

    const normalizeByAvg = (v) => {
      const r = (255 - avg) * Math.abs(v - avg) / avg
      // let r = 4 * v - (v*v)/64
      if (r >= 255) return 255
      if (r <= 0) return 0
      return r
    }
    const normalize = (v) => {
      return normalizeByAvg(v)
    }

    const size = weirdOutputNormalized.length
    for (let ix = 0; ix < size; ix++) {
      if (playing) {
        sound.playNote(ix / size, undefined, weirdOutput.data[ix] / 256)
      }
      // resOsc.push(beep(1000 + 16 * ix, 0.10 * weirdOutput[ix]/256))
    }

    resultContext.putImageData(outputImageData, 0, 0)
    linearContext.putImageData(linearImageData, 0, 0)

    // window.requestAnimationFrame(() => {
    setTimeout(() => {
      drawFrame()
    // })
    }, 200)
  }

  window.requestAnimationFrame(() => {
    drawFrame()
  })
}, false)
