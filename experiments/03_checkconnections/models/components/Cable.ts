import { ElectronicComponent, tempPosition } from "../ElectronicComponent"
import { Node } from "../Node"
import { addConnection } from "../Connection"

export class Cable extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      1: new Node(tempPosition, this),
      2: new Node(tempPosition, this),
    }

    // "Internal wiring"
    addConnection(this.nodes[1], this.nodes[2])
  }
}