
export const checkParams = (val, type, msg) => {
  let valid = true
  if (type === 'array') {
    valid = Array.isArray(val)
  } else if (typeof type === 'function') {
    valid = type(val)
  } else {
    // eslint-disable-next-line valid-typeof
    valid = typeof val === type
  }
  if (!valid) {
    console.error(msg)
    throw new Error(msg)
  }
}
