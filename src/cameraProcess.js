
import { getIndex, getColor } from './imageData'
import { checkParams } from './utils'
import { xy2d } from './hilbert'
/*
  cfg should contain:
    inputSize
    outputSize
    outputResolution
  returns
    hilbert structure
*/
export const createLowResMap = (inputImage, outputImage, cfg) => {
  checkParams(cfg, 'object', 'Config parameter missing')
  checkParams(cfg.inputSize, 'number', 'inputSize must a number')
  checkParams(cfg.outputSize, 'number', 'outputSize must a number')
  checkParams(cfg.outputResolution, 'number', 'outputResolution must a number')
  const ratio = cfg.outputSize / cfg.outputResolution
  checkParams(ratio, Number.isInteger, 'ratio between outputSize & outputResolution must be integer')

  const hilbertMap = []
  const level = Math.log2(cfg.outputResolution)
  checkParams(level, Number.isInteger, 'outputResolution should be power of 2')
  for (let _x = 0; _x < cfg.outputResolution; _x++) {
    for (let _y = 0; _y < cfg.outputResolution; _y++) {
      let res = 0
      for (let _xd = 0; _xd < ratio; _xd++) {
        for (let _yd = 0; _yd < ratio; _yd++) {
          res += getColor(inputImage, _x * ratio + _xd, _y * ratio + _yd)
        }
      }
      res /= (ratio * ratio)
      hilbertMap[xy2d(_x, _y, level)] = res
      for (let _xd = 0; _xd < ratio; _xd++) {
        for (let _yd = 0; _yd < ratio; _yd++) {
          const ix = getIndex(_x * ratio + _xd, _y * ratio + _yd, cfg.outputSize)
          outputImage.data[ix + 0] = res
          outputImage.data[ix + 1] = res
          outputImage.data[ix + 2] = res
          outputImage.data[ix + 3] = 256
        }
      }
    }
  }
  return {
    data: hilbertMap,
    level: level
  }
}

export default {
  createLowResMap
}
