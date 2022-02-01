# Research Project
Welkom bij de presentatie van mijn Research Project met de onderzoeksvraag "Hoe kan Three.js bijdragen aan een interactieve 3D-tutorial voor elektronica componenten?"

**https://create.arduino.cc/projecthub/abdularbi17/ultrasonic-sensor-hc-sr04-with-arduino-tutorial-327ff6**
**https://www.tinkercad.com/learn/circuits**

Het idee was een alternatief voor een video of tekstuitleg over hoe je componenten moet schakelen.
Zo kan de gebruiker een bepaalde sensor proberen schakelen in een virtuele omgeving.
Het zou ook een alternatief voor of een verbetering van sites zoals Tinkercad Circuits kunnen zijn.

# Technologie
De technologie die ik zou gaan gebruiken is Three.js.

Three.js is een JavaScript library en API die bewegende 3D graphics toont op het canvas element met behulp van WebGL. Dankzij WebGL kan je gebruik maken van de GPU in plaats van de CPU om zaken weer te geven.

Ik koos voor Three.js en niet voor Unity, omdat ik een applicatie wou die veel mensen kunnen gebruiken.
Omdat het in de browser draait hoeven mensen geen extra software te installeren.

# Demo
**https://researchproject-karelbousson.vercel.app/**

# Hoe ben ik aan de slag gegaan
## Wat is Three.js
**https://threejs.org/**

Ik ben begonnen met op de Three.js wat voorbeelden te bekijken en wat Youtube video's te bekijken over Three.js.

## ThreeJS leren
**https://threejs-journey.com/**

Uiteindelijk kwam ik terecht op 'Three.js Journey'
Deze cursus van Bruno Simon leek mij de perfecte basis voor mijn project.

Deze cursus begint bij de basis en behandelt verderop ook zaken zoals shaders, performance tips, geavanceerde animaties...

Ik besloot de de eerste 16 lessen te bekijken en daarna enkel de lessen die mij nog van toepassing leken op dit project.


## Life Long Learning
Naast deze cursus, sloot ik mij ook aan in de Three.js en Three.js Journey discords.
Hier kon ik vragen stellen als ik vastliep en mensen helpen die met gelijkaardige problemen zaten.

<!-- ## TypeScript
Om de kwaliteit van de code te verbeteren heb ik gebruik gemaakt van TypeScript, dit werd niet gedaan in de ThreeJS course, maar het maakt de code duidelijker en minder foutgevoelig.

We leerden reeds met TypeScript werken in de opleiding. -->

## Meer dan gewoon Three.js
Gewoon Three.js leren bestaat niet. Je komt vaak zaken tegen die je misschien nog niet kent als je niet gewoon bent van in 3D-omgevingen te werken: Vectors, Normals, Quaternion, GLTF.

Een groot deel van deze termen wordt uitgelegd in de cursus, maar soms moet je even Googlen.

Eén van de zaken die je bijvoorbeeld moet uitzoeken, is welke controls je gaat gebruiken.

## Controls
**https://threejs.org/examples/?q=controls**

Er zijn al heel wat controls gemaakt voor ThreeJS.js
Deze laten het toe om de camera te bewegen, draaien en zorgen voor interactie met objecten.

Omdat ik geen controls vond die mij aanstonden, heb ik deze zelf geprogrammeerd.

**https://threejs.org/examples/#misc_controls_pointerlock**

Ik wou eerst een variant maken van de PointerLockControls. Hier verdwijnt de muis en kan je blijven rondbewegen. Echter vond ik het niet ideaal dat de muis verdween en wou ik de muis zelf gebruiken voor interactie met objecten.

**https://threejs.org/examples/#misc_controls_drag**

Voor het bewegen van objecten, heb ik mij gebaseerd op de DragControls om objecten te bewegen.

1. Rondkijken doe je door met rechtermuisknop ingedrukt te draggen. Je kan oneindig rondjes draaien, maar verticaal kan je maar 180° draaien (van je voeten tot boven).

2. Objecten kun je bewegen met linkermuisknop.
   1. Standaard naar links, rechts, voor en achter.
   2. Met shift ingedrukt naar links, rechts, omhoog en omlaag

## Raycasters
In mijn project heb ik vaak gebruik gemaakt van Raycasters.

Een raycaster schiet een straal af vanaf een bepaald punt in een bepaalde richting.

Ik heb dit gebruikt om
- objecten te verplaatsen,
- pinnen te selecteren om te schakelen
- en om afstand te meten met een ultrasone sensor.

## Physics (cannon-es)
In ThreeJS zitten geen physics.
Buiten realistisch licht, kan je dus geen objecten laten vallen of bewegen op natuurlijke wijze.

Hiervoor heb je een aparte library nodig zoals Ammo, Bullet of Cannon-es.
Ik koos voor cannon-es.

Om physics toe te voegen, maak je een nieuwe physics wereld aan en voeg je de objecten nog eens toe aan die wereld. Elke frame update je dan de transformatie in de 3D wereld met die van de physics wereld.

## Schakelingen maken
Als laatste moest ik nog een manier vinden om schakelingen op te slaan en te kijken als zaken goed verbonden zijn.

Ik koos ervoor om de werken met pinnetjes en connecties.
Een elektronica component heeft meerdere pinnetjes, deze hebben een unieke naam binnen dat component.

Ik hou dan bij in een array welke pinnetjes met elkaar verbonden zijn.

**https://jarednielsen.com/data-structure-graph-depth-first-search/**

Om te kijken als er een verbinding is tussen twee pinnen, maakte ik gebruik van een soort Depth First Search algoritme. Je start bij een bepaald punt en kijkt als je via zijn connecties het eindpunt kan bereiken. Het is een recursieve functie.

## Extra: VR
**file:///D:/Github/MCT-RESEARCHPROJECT/VR%20demo.mp4**

Om even wat anders te doen, heb ik ook nog research gedaan naar de mogelijkheid om VR toe te voegen.

Ik heb dit niet in de uiteindelijke demo gezet, omdat dit nog teveel tijd zou kosten om volledig uit te werken met alle controls, maar wel een video meegeleverd als bijlage.