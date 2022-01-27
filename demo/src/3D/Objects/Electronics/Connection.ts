import { Pin } from './Pin'

export class Connection {
  from: Pin
  to: Pin

  constructor(from: Pin, to: Pin) {
    this.from = from
    this.to = to
  }
}

export const addConnection = (pin1: Pin, pin2: Pin) => {
  // Check if this connection already exists?
  const pin1Connection: Connection = {
    from: pin1,
    to: pin2
  }

  const contains = pin1.parent.connections.some(p => p.from === pin1 && p.to === pin2)
  if (contains) {
    console.log("this connection already exists")
    return
  }

  console.log("Connecting")

  pin1.parent.connections.push(pin1Connection)

  pin2.parent.connections.push({
    from: pin2,
    to: pin1
  })
}