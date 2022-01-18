import { ElectronicComponent, tempPosition } from "../ElectronicComponent"
import { Node } from "../Node"

export class UltrasoneSensor extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      1: new Node(tempPosition, this),
      2: new Node(tempPosition, this),
      3: new Node(tempPosition, this),
      4: new Node(tempPosition, this),
    }
  }
}