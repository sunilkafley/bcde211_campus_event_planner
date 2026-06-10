import 'fake-indexeddb/auto'

if (!global.structuredClone) {
  global.structuredClone = (value) => {
    return JSON.parse(JSON.stringify(value))
  }
}
