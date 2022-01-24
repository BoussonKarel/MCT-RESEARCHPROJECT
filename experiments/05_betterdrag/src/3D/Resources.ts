import {EventEmitter} from 'events'
import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let resources: Resources = null

export class Resources extends EventEmitter {
  sources: any
  items: any

  toLoad: number
  loaded: number

  loaders: {[key: string]: THREE.Loader}
  
  textureLoader: THREE.TextureLoader
  gltfLoader: GLTFLoader
  cubeTextureLoader: THREE.CubeTextureLoader

  constructor(sources: any[]) {
    super()

    if (resources) return resources
    resources = this
    
    this.sources = sources
    this.items = {}

    this.toLoad = this.sources.length
    this.loaded = 0

    this.textureLoader = new THREE.TextureLoader()
    this.gltfLoader = new GLTFLoader()
    this.cubeTextureLoader = new THREE.CubeTextureLoader()

    this.loadResources()
  }

  loadResources() {
    console.log("Loading resources")
    for (const source of this.sources) {
      if (source.type === "texture") {
        this.textureLoader.load(source.path, (file) => {
          this.items[source.name] = file
          
          this.loaded++
          if (this.loaded === this.toLoad) this.emit('loaded')
        })
      }
      if (source.type == "gltfModel") {
        this.gltfLoader.load(source.path, (file) => {
          this.items[source.name] = file

          this.loaded++
          if (this.loaded === this.toLoad) this.emit('loaded')
        })
      }
      if (source.type == "cubeTexture") {
        this.cubeTextureLoader.load(source.path, (file) => {
          this.items[source.name] = file

          this.loaded++
          if (this.loaded === this.toLoad) this.emit('loaded')
        })
      }
    }
  }
}
