import "./style.css"

import * as dat from 'lil-gui'
import * as THREE from 'three'
import { World } from "./3D/World"
import { DebugSpawner } from "./3D/Objects/DebugSpawner"
import { Debug } from "./3D/Debug"

const world = new World()

const debugSpawner = new DebugSpawner()