# Contractplan
## Onderzoeksvraag
Hoe kan Three.JS bijdragen aan een interactieve 3D-tutorial voor elektronica componenten?

## Deelvragen
### Welke elektronica componenten zijn er interessant om te simuleren in 3D t.o.v. 2D?

### Welke tools bestaan er reeds om (in 2D/3D) elektrische schakelingen te simuleren? 

### Wat is de meerwaarde van 3D t.o.v. 2D om de werking van elektronica componenten uit te leggen? 

### Welke voor- en nadelen biedt een 3D-tutorial t.o.v. een gewone handleiding? 

### Welke voor- en nadelen biedt een 3D-tutorial t.o.v. een video tutorial?
 
### Welke alternatieven bestaan er voor Three.JS waarmee je een dergelijke toepassing kan maken? 

### Kan een gemiddelde gebruiker de simulatie draaien zonder performance issues?

## Technisch onderzoek
Uitwerken van een 3D-tutorial voor verschillende elektronica componenten met behulp van Three.JS voor de 3D-visualisatie en interactie.

Het uitwerken van verschillende scenario’s, enkele voorbeelden zijn:
- Een schakeling met een ToF of Ultrasone sensor, waarbij op een computerscherm of LCD de waarden getoond worden.
- Een schakeling met een Gyroscoop, waarbij je een 3D object ziet bewegen met de gyroscoop. - Een schakeling met een LDR, waarbij je een lamp kan verplaatsen. - Een schakeling met motoren, bv. een robot die een lijn volgt. 
- Een schakeling met een RFID kaartlezer.

Bij elk scenario krijgt de gebruiker instructies (stap per stap) en de nodige componenten om de schakeling te maken.

Het is geen vrije sandbox waarbinnen de gebruiker alles kan dat hij met een gewone Raspberry Pi kan. De gebruiker beschikt enkel over de componenten nodig voor het scenario / de tutorial.

## MVP
De proof of concept zal een 2 tot 3 scenario’s bevatten met één of meerdere sensoren of actuatoren. De componenten die de gebruiker krijgt zijn geavanceerder dan een gewone LED. Het is een meerwaarde om de schakeling in 3D te maken t.o.v. dezelfde schakeling in 2D.

De gebruiker kan met deze componenten ook zaken verkeerd schakelen, waarbij de demo een gepaste reactie geeft: het component breekt en/of de gebruiker krijgt hierbij de gepaste melding.