# Verloop Research Project
1. ThreeJS leren
Ik ben begonnen met de threejs-journey.com course van Bruno Simon, een expert op het vlak van ThreeJS. Hier leerdere ik de basis van 3D objecten maken met WebGL.

Echter kan je niet "gewoon ThreeJS leren", je kan wel het één en ander in elkaar steken, maar een betere kennis van 3D helpt enorm.

2. TypeScript
Om de kwaliteit van de code te verbeteren heb ik gebruik gemaakt van TypeScript, dit werd niet gedaan in de ThreeJS course, maar ik vind persoonlijk dat dit het programmeren wat makkelijker maakt: je krijgt bv. betere IntelliSense.

3. 3D
   1. GLTF
      - Om 3D modellen te kunnen importeren, maken we gebruik van GLTF, een "standaard" format voor 3D scenes en modellen, gebruikt in onder andere Blender, Maya... maar ook in TinkerCad, waar ik mijn basis vormen in heb gemaakt.
   2. Controls
      - In ThreeJS zijn er al heel wat controls gemaakt die je kan overnemen, deze bedienen als het ware je camera en sommigen zorgen ook voor interactie met de objecten.
      - Ik vond geen control die mij aanstond, dus heb ik er zelf één geschreven.
      1. Rondkijken doe je door met rechtermuisknop ingedrukt te draggen. Je kan oneindig rondjes draaien, maar verticaal kan je maar 180° draaien (van je voeten tot boven).
      2. Objecten kun je bewegen met linkermuisknop. Dit over een horizontale plane (dus over de x en z-axis), dus links-rechts en vooruit-achteruit.
      3. Wanneer je shift ingedrukt houdt, kun je een object bewegen over een verticale plane (over de x en y-axis), dus links-rechts en omhoog-omlaag.
   3. Raycasters
      - Een raycaster is een straal die je afschiet vanaf een punt, in een bepaalde richting. Dit wordt bijvoorbeeld gebruikt om te detecteren welk object onder de muis ligt.
      - Dit kan je ook gebruiken op objecten en niet enkel op de camera, bijvoorbeeld voor de onzichtbare straal van een ultrasone sensor, om de afstand te meten tot het eerste object.
4. Physics
- Physics zet ik los van ThreeJS, dit omdat dit een heel andere library is. Om physics te integreren, moet je een "physics wereld" aanmaken. Elk object die je physics wil geven, moet je dan ook toevoegen aan deze wereld.
- Elke frame kopieer je dan de gegevens zoals positie en rotatie van de physics objecten naar de 3D objecten. Zo komt je scene tot leven.

5. Elektronica / wiskunde