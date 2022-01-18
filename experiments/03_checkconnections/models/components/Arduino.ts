import { ElectronicComponent, tempPosition } from "../ElectronicComponent"
import { Node, NodeType} from "../Node"

export class Arduino extends ElectronicComponent {
  constructor(object) {
    super(object)

    this.nodes = {
      "5V": new Node(tempPosition, this, NodeType.OUTPUT),
      d2: new Node(tempPosition, this, NodeType.OUTPUT),
      d3: new Node(tempPosition, this, NodeType.OUTPUT),
      GND: new Node(tempPosition, this, NodeType.GROUND),
    }
  }
}