
// From Mike Bostock: http://bl.ocks.org/597287
// Adapted from Nick Johnson: http://bit.ly/biWkkq

const pairs = [
  [[0, 3], [1, 0], [3, 1], [2, 0]],
  [[2, 1], [1, 1], [3, 0], [0, 2]],
  [[2, 2], [3, 3], [1, 2], [0, 1]],
  [[0, 0], [3, 2], [1, 3], [2, 3]]
]

// d2xy and rot are from:
// http://en.wikipedia.org/wiki/Hilbert_curve#Applications_and_mapping_algorithms

const rot = (n, x, y, rx, ry) => {
  if (ry === 0) {
    if (rx === 1) {
      x = n - 1 - x
      y = n - 1 - y
    }
    return [y, x]
  }
  return [x, y]
}
export const xy2d = (x, y, z) => {
  let quad = 0
  let pair
  let i = 0
  while (--z >= 0) {
    pair = pairs[quad][(x & (1 << z) ? 2 : 0) | (y & (1 << z) ? 1 : 0)]
    i = (i << 2) | pair[0]
    quad = pair[1]
  }
  return i
}

export const d2xy = (z, t) => {
  const n = 1 << z
  let x = 0
  let y = 0
  for (let s = 1; s < n; s *= 2) {
    const rx = 1 & (t / 2)
    const ry = 1 & (t ^ rx)
    const xy = rot(s, x, y, rx, ry)
    x = xy[0] + s * rx
    y = xy[1] + s * ry
    t /= 4
  }
  return [x, y]
}

export default {
  xy2d,
  d2xy
}
