export function assertString (str, name) {
  if (typeof str !== 'string') {
    throw new Error(`${name || ''} must be a string`.trimLeft());
  }
}

export function assertNumber (num, name) {
  if (typeof num !== 'number') {
    throw new Error(`${name || ''} must be a number`.trimLeft());
  }
}

export function assertObject (obj, name) {
  if (!(obj && obj.constructor.name === 'Object')) {
    throw new Error(`${name || ''} must be an object`.trimLeft());
  }
}

export function assertArray (arr, name) {
  if (!(arr && arr.constructor.name === 'Array')) {
    throw new Error(`${name || ''} must be an array`.trimLeft());
  }
}
