import { ElectronicComponent, tempPosition } from "../ElectronicComponent"
import { Node } from "../Node"

export class Resistor extends ElectronicComponent {
  constructor(object, resistance: number) {
    super(object)

    this.nodes = {
      1: new Node(tempPosition, this),
      2: new Node(tempPosition, this),
    }

    this.resistance = resistance

    // "Internal wiring"
    this.addConnection(this.nodes[1], this.nodes[2])
  }
}