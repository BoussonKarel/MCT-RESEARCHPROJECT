import {EventEmitter} from 'events'
import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Resources extends EventEmitter {
  constructor(sources) {
    super()
    
    this.sources = sources
    this.items = {}

    this.toLoad = this.sources.length
    this.loaded = 0

    this.loaders = {}
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.gltfLoader = new GLTFLoader()
    // this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()

    this.loadResources()
  }

  loadResources() {
    for (const source of this.sources) {
      let loader = null
      if (source.type === "texture") loader = this.loaders.textureLoader
      if (source.type === "gltfModel") loader = this.loaders.gltfLoader
      if (source.type === "cubeTexture") loader = this.loaders.cubeTextureLoader

      if (loader)
        loader.load(source.path, (file) => {
          this.items[source.name] = file

          this.loaded++
          if (this.loaded === this.toLoad) {
            this.emit('loaded')
          }
        })
    }
  }
}
