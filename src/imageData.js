
export const getIndex = (x, y, width) => {
  return y * (width * 4) + x * 4
}

export const getColor = (image, x, y) => {
  const ix = getIndex(x, y, 480)
  return (
    image.data[ix + 0] * 0.3 +
    image.data[ix + 1] * 0.59 +
    image.data[ix + 2] * 0.11
  )
}

export default {
  getIndex,
  getColor
}
