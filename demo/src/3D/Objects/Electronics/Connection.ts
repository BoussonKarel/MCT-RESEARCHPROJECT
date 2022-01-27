import { Pin } from './Pin'

export interface Connection {
  from: Pin
  to: Pin
}

export const addConnection = (pin1: Pin, pin2: Pin) => {
  // Check if this connection already exists?

  pin1.parent.connections.push({
    from: pin1,
    to: pin2
  })

  pin2.parent.connections.push({
    from: pin2,
    to: pin1
  })
}