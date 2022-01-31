# Research kort uitgelegd
- Wat is Three.js, waar kan ik het leren... [1]
+ Via Three.js site en een Youtuber een goede cursus gevonden van Bruno Simon [2]
- Controls gemaakt om rond te kijken gebaseerd op PointerLockControls [3] [4]
+ Wat is Pointerlock precies, eigen variant gemaakt [5]
- Basis raycaster om objecten te verplaatsen [6]
+ Om connecties te leggen tussen elektronica "pinnen" of nodes, een soort variant van Graphs en DFS gebruikt. [7]
- Betere code structuur, event emitter van 'events' api toegevoegd [8]
+ Controls gemaakt om objecten te bewegen op basis van DragControls [9] [10]
- Opzoekingen rond de zaken gebruikt in deze controls:
  - Wat is 'Plane.setFromNormalAndCoplanarPoint' [11]
  - Wat is een normal point [12]
  - Wat is een coplanar point [13]
  - Wat doet 'Ray.intersectPlane' [14]
+ Physics toegevoegd: library cannon-es [15] (deels gezien in threejs-journey)
- Licht intensiteit meten is niet direct mogelijk, wel de intensiteit op een bepaalde pixel, maar dit is redelijk lastig en niet echt wat we zoeken, want de pixel (LDR) is niet altijd zichtaar. [16]
+ Pins toevoegen aan een sensor, nesten met Object3D.add() [17]
- Toevoegen van een kabel tussen de twee, hiervoor moet je de lokale coördinaten van een pin binnen zijn parent omzetten naar wereldcoördinaten (localToWorld) [18]

+ Add VR to project [19]

## Bronnen
- [1]‘Three.js – JavaScript 3D Library’. https://threejs.org/ (geraadpleegd 10 januari 2022).
+ [2]‘Three.js Journey — Learn WebGL with Three.js’. https://threejs-journey.com/ (geraadpleegd 10 januari 2022).
- [3]‘PointerLockControls – three.js docs’. https://threejs.org/docs/#examples/en/controls/PointerLockControls (geraadpleegd 13 januari 2022).
+ [4]mrdoob, three.js/examples/misc_controls_pointerlock.html. 2022. Geraadpleegd: 13 januari 2022. [Online]. Beschikbaar op: https://github.com/mrdoob/three.js/blob/efbfc67edc7f65cfcc61a389ffc5fd43ea702bc6/examples/misc_controls_pointerlock.html
- [5]‘Pointer Lock API - Web APIs | MDN’. https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API (geraadpleegd 13 januari 2022).
+ [6]‘Raycaster – three.js docs’. https://threejs.org/docs/#api/en/core/Raycaster (geraadpleegd 14 januari 2022).
- [7]‘Data Structures in JavaScript: Depth-First Search Graph Traversal’. https://jarednielsen.com/data-structure-graph-depth-first-search/ (geraadpleegd 17 januari 2022).
+ [8]‘Events | Node.js v17.4.0 Documentation’. https://nodejs.org/api/events.html (geraadpleegd 19 januari 2022).
- [9]‘DragControls – three.js docs’. https://threejs.org/docs/#examples/en/controls/DragControls (geraadpleegd 19 januari 2022).
+ [10]mrdoob, three.js/examples/misc_controls_drag.html. 2022. Geraadpleegd: 19 januari 2022. [Online]. Beschikbaar op: https://github.com/mrdoob/three.js/blob/efbfc67edc7f65cfcc61a389ffc5fd43ea702bc6/examples/misc_controls_drag.html
- [11]‘Plane#setFromNormalAndCoplanarPoint – three.js docs’. https://threejs.org/docs/#api/en/math/Plane.setFromNormalAndCoplanarPoint (geraadpleegd 19 januari 2022).
+ [12]‘Normal (geometry) - Wikipedia’. https://en.wikipedia.org/wiki/Normal_(geometry) (geraadpleegd 19 januari 2022).
- [13]‘Coplanarity’, Wikipedia. 3 november 2021. Geraadpleegd: 19 januari 2022. [Online]. Beschikbaar op: https://en.wikipedia.org/w/index.php?title=Coplanarity&oldid=1053393164
+ [14]‘Ray#intersectPlane – three.js docs’. https://threejs.org/docs/#api/en/math/Ray.intersectPlane (geraadpleegd 19 januari 2022).
- [15]‘cannon-es’. https://pmndrs.github.io/cannon-es/docs/index.html (geraadpleegd 20 januari 2022).
+ [16]‘javascript - ThreeJS - How do I measure light intensity / pixel values at a given point in x/y/z?’, Stack Overflow. https://stackoverflow.com/questions/46346248/threejs-how-do-i-measure-light-intensity-pixel-values-at-a-given-point-in-x (geraadpleegd 25 januari 2022).
- [17]‘Object3D#add – three.js docs’. https://threejs.org/docs/#api/en/core/Object3D.add (geraadpleegd 26 januari 2022).
+ [18]‘Object3D#localToWorld – three.js docs’. https://threejs.org/docs/#api/en/core/Object3D.localToWorld (geraadpleegd 27 januari 2022).
