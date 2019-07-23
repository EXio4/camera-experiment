
import hilbert from './hilbert'

const arr = []

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let _nextCbs = []
const onNext = (cb) => {
  _nextCbs.push(cb)
}

const runNext = () => {
  const local = _nextCbs
  _nextCbs = []
  local.forEach((cb) => {
    cb()
  })
}

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

  const video = document.getElementById('video')
  const mediaConfig = { video: true }
  const errBack = function (e) {
            	console.log('An error has occurred!', e)
  }

  // Put video listeners into place
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(mediaConfig).then(function (stream) {
      // video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream
      video.play()
    })
  }

  /* Legacy code below! */
  else if (navigator.getUserMedia) { // Standard
    navigator.getUserMedia(mediaConfig, function (stream) {
      video.src = stream
      video.play()
    }, errBack)
  } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(mediaConfig, function (stream) {
      video.src = window.webkitURL.createObjectURL(stream)
      video.play()
    }, errBack)
  } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
    navigator.mozGetUserMedia(mediaConfig, function (stream) {
      video.src = window.URL.createObjectURL(stream)
      video.play()
    }, errBack)
  }

  const getIndex = (x, y, width) => {
    return y * (width * 4) + x * 4
  }

  function beep (frequency, strength) {
    var oscillator = audioCtx.createOscillator()
    var gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    gainNode.gain.value = strength
    oscillator.frequency.value = frequency
    oscillator.type = 0

    return oscillator
  };

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
    const linearImageData = resultContext.createImageData(256, 64)

    const getColor = (x, y) => {
      const ix = getIndex(x, y, 480)
      return (
        inputImageData.data[ix + 0] * 0.3 +
                        inputImageData.data[ix + 1] * 0.59 +
                        inputImageData.data[ix + 2] * 0.11
      )
    }

    const weirdOutput = []
    for (let _x = 0; _x < 16; _x++) {
      for (let _y = 0; _y < 16; _y++) {
        let res = 0
        for (let _xd = 0; _xd < 30; _xd++) {
          for (let _yd = 0; _yd < 30; _yd++) {
            res += getColor(_x * 30 + _xd, _y * 30 + _yd)
          }
        }
        res /= (16 * 16)

        weirdOutput[hilbert.xy2d(_x, _y, 4)] = res
      }
    }

    const { min, max } = stats(weirdOutput)
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
    const weirdOutputNormalized = weirdOutput.map(normalizeMinMax)
    const { avg } = stats(weirdOutputNormalized)
    console.log({ min, max, avg })

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

    for (let _d = 0; _d < 256; _d++) {
      for (let _y = 0; _y < 16; _y++) {
        const pair = hilbert.d2xy(4, _d)
        const _x = pair[0]
        const _y = pair[1]
        const res = normalize(weirdOutputNormalized[_d])

        for (let _xd = 0; _xd < 30; _xd++) {
          for (let _yd = 0; _yd < 30; _yd++) {
            const ix = getIndex(_x * 30 + _xd, _y * 30 + _yd, 480)
            outputImageData.data[ix + 0] = res
            outputImageData.data[ix + 1] = res
            outputImageData.data[ix + 2] = res
            outputImageData.data[ix + 3] = inputImageData.data[ix + 3]
          }
        }
      }
    }

    const resOsc = []
    for (let ix = 0; ix < 256; ix++) {
      for (let d = 0; d < 64; d++) {
        const _ix = getIndex(ix, d, 256)
        const res = normalize(weirdOutputNormalized[ix])
        linearImageData.data[_ix + 0] = res
        linearImageData.data[_ix + 1] = res
        linearImageData.data[_ix + 2] = res
        linearImageData.data[_ix + 3] = 256
      }
      // resOsc.push(beep(1000 + 16 * ix, 0.10 * weirdOutput[ix]/256))
    }
    runNext()
    resOsc.forEach(osc => {
      osc.start()
    })
    onNext(() => {
      resOsc.forEach(osc => {
        osc.stop()
      })
    })

    resultContext.putImageData(outputImageData, 0, 0)
    linearContext.putImageData(linearImageData, 0, 0)

    window.requestAnimationFrame(() => {
      // setTimeout(() => {
      drawFrame()
    })
    // }, 2000)
  }

  window.requestAnimationFrame(() => {
    drawFrame()
  })
}, false)
