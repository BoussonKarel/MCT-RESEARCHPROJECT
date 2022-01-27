import { Pin } from "./Pin"

export class Connection {
  a: Pin
  b: Pin

  constructor(a: Pin, b: Pin) {
    this.a = a
    this.b = b
  }
}