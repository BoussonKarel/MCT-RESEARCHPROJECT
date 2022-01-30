# Verloop Research Project
## Wat is Three.js
**https://threejs.org/**

Ik begon met wat rond te snuisteren op de site van ThreeJS en de voorbeelden te bekijken.
Daarnaast keek ik ook wat YouTube video's over wat ThreeJS is en wat je ermee kan.

## ThreeJS leren
**https://threejs-journey.com/**

Beide op de site van ThreeJS en op de een paar YouTube video's kwam ik de cursus 'Three.js journey' tegen.

Deze cursus van Bruno Simon leek mij de perfecte basis voor mijn project.

Deze cursus begint bij de basis en behandelt verderop ook zaken zoals shaders, performance tips, geavanceerde animaties...

Ik besloot de de eerste 16 lessen te bekijken en daarna enkel de lessen die mij nog van toepassing leken op dit project.

## Meer dan gewoon Three.js
Gewoon Three.js leren bestaat niet. Je komt vaak begrippen of functies tegen die je even moet opzoeken.
Dit zijn niet altijd Three.js-specifieke begrippen, maar vaak begrippen die in de 3D-wereld vaak voorkomen.

Begrippen zoals Vectors, Normals, Rotation, Quaternion... het bestandsformaat GLTF.
Een groot deel wordt uitgelegd in de Three.js cursus, maar soms moet je even de documentatie raadplegen of Googlen.

## TypeScript
Om de kwaliteit van de code te verbeteren heb ik gebruik gemaakt van TypeScript, dit werd niet gedaan in de ThreeJS course, maar het maakt de code duidelijker en minder foutgevoelig.

We leerden reeds met TypeScript werken in de opleiding.

## Controls
**https://threejs.org/examples/?q=controls**
Er zijn al heel wat controls gemaakt voor ThreeJS, deze laten het toe om de camera te bewegen, draaien en zorgen voor interactie met objecten.

Omdat ik geen controls vond die mij aanstonden, heb ik deze zelf geprogrammeerd.

Ik baseerde mij op de bestaande DragControls voor het bewegen van objecten.
Hier kan je op een object klikken en deze bewegen.
**https://threejs.org/examples/#misc_controls_drag**

Om rond te kijken, dacht ik eerst aan PointerLockControls, maar ik wou de muis zichtbaar houden, dus ik besloot te kiezen voor een eigen variant waarbij je rechtermuisknop ingedrukt houdt.
**https://threejs.org/examples/#misc_controls_pointerlock**

1. Rondkijken doe je door met rechtermuisknop ingedrukt te draggen. Je kan oneindig rondjes draaien, maar verticaal kan je maar 180° draaien (van je voeten tot boven).

2. Objecten kun je bewegen met linkermuisknop.
   1. Standaard naar links, rechts, voor en achter.
   2. Met shift ingedrukt naar links, rechts, omhoog en omlaag

## Raycasters
Een raycaster is een straal die je afschiet vanaf een punt, in een bepaalde richting. Dit wordt bijvoorbeeld gebruikt om te detecteren welk object onder de muis ligt.

Dit kan je ook gebruiken op objecten. Zo kan je bijvoorbeeld een onzichtbare straal schieten vanaf een ultrasone sensor, om de afstand te meten tot het dichtste object.

## Physics (cannon-es)
Physics zet ik los van ThreeJS.

In ThreeJS zitten standaard geen physics 

Om physics te integreren, moet je een "physics wereld" aanmaken. Elk object die je physics wil geven, moet je dan ook toevoegen aan deze wereld.

Elke frame kopieer je dan de gegevens zoals positie en rotatie van de physics objecten naar de 3D objecten. Zo komt je scene tot leven.

## Verbindingen tussen objecten
**https://jarednielsen.com/data-structure-graph-depth-first-search/**
Om te kijken als er een verbinding is tussen twee pinnen, maakte ik gebruik van een soort Depth First Search algoritme. Je start bij een bepaald punt en kijkt als je via zijn connecties het eindpunt kan bereiken. Het is een recursieve functie.