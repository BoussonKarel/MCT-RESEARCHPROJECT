import { ElectronicComponent, tempPosition } from "../ElectronicComponent"
import { Node } from "../Node"

export class Arduino extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      "5V": new Node(tempPosition, this),
      d2: new Node(tempPosition, this),
      d3: new Node(tempPosition, this),
      GND: new Node(tempPosition, this),
    }
  }
}