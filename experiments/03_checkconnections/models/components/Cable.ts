import { ElectronicComponent, tempPosition } from "../ElectronicComponent"
import { Node } from "../Node"

export class Cable extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      1: new Node(tempPosition, this),
      2: new Node(tempPosition, this),
    }

    // "Internal wiring"
    this.addConnection(this.nodes[1], this.nodes[2])
  }
}