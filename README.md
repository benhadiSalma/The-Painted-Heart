# Project: The Painted Heart – Brussels Comic Explorer

## Projectbeschrijving

The Painted Heart is een interactieve webapplicatie die de Brusselse striproute transformeert in een digitale ontdekkingstocht.

De applicatie combineert meerdere strategische pijlers om de gebruikerservaring te versterken:

- Exploratie: Dynamische verkenning van de stad op basis van reële open data.
- Progressie: Een visueel "Scrapbook" dat geleidelijk wordt ontgrendeld naarmate de gebruiker murals bezoekt.
- Personalisatie: Mogelijkheid om favorieten op te slaan en persoonlijke “detective notities” toe te voegen per locatie.

---

## Gebruikte API

De applicatie maakt gebruik van de officiële Open Data API van Brussel:

- Dataset: Bruxelles Parcours BD  
- Endpoint:  
  https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=30  

---

## Technische Implementatie (JavaScript)

### 1. DOM Manipulatie & Events

Selectie & Manipulatie:  
Gebruik van `document.getElementById` en `querySelector` voor het dynamisch beheren van UI-elementen zoals de galerij, het scrapbook en de modal-vensters  
[Lijnen 4–18, 126–141, 342–345, 373, 403, 433–437, 465]

Events:  
Interactiebeheer via `addEventListener` voor navigatie, filters, taalwissel, dark mode en gebruikersacties op kaarten  
[Lijnen 154–199, 264–300, 347–360, 439–462]

---

### 2. Modern JavaScript (ES6+)

Data-structuren:  
Gebruik van `const` en `let` voor een duidelijke en voorspelbare variabele-scope  
[Lijnen 4–49]

Template Literals:  
Dynamische HTML-generatie voor kaarten, scrapbook-elementen, modals en statusberichten via backticks  
[Lijnen 205, 213, 222, 230, 232, 310, 328–340, 384–394, 412–429, 487, 495–499]

Array Methodes:  
Gebruik van `.forEach()`, `.filter()`, `.sort()`, `.map()` en `.includes()` voor filtering, sortering en rendering  
[Lijnen 29, 191, 228, 231, 237–257, 313, 376, 506, 508, 518, 520]

Arrow Functions & Ternary Operators:  
Toegepast voor compacte logica in callbacks, event listeners en de statuscontrole in het Scrapbook  
[Lijnen 27–33, 154–199, 231, 250–256, 264–300, 313, 347–360, 376, 385, 388–390, 442–462]

---

### 3. Asynchrone Code & API

Async/Await & Fetch:  
De functie `fetchMurals()` haalt data op via een asynchrone API-call en verwerkt JSON-responses met foutafhandeling  
[Lijnen 204–224]

Intersection Observer API:  
Gebruikt om kaarten pas zichtbaar te maken wanneer ze in beeld komen, wat zorgt voor betere performance en vloeiende animaties  
[Lijnen 22–34, 363–364]

---

### 4. Opslag & Validatie

Formulier Validatie:  
Notities worden enkel opgeslagen indien ze niet leeg zijn en minstens 5 tekens bevatten  
[Lijnen 442–461]

LocalStorage:  
Persistente opslag van gebruikersdata (favorieten, bezochte murals, notities) via `JSON.parse` en `JSON.stringify`  
[Lijnen 40–42, 505, 517, 529, 507–523, 531–533]

---

### 5. Extra Functionaliteiten

Meertaligheid (i18n):  
Ondersteuning voor Engels, Frans en Nederlands via een centrale `translations`-structuur en dynamische UI-update  
[Lijnen 54–149, 297–300, 479–499]

Sortering (A-Z / Z-A):  
De galerij kan alfabetisch gesorteerd worden via `localeCompare()`  
[Lijnen 248–256, 277–281]

Scrapbook Unlock-systeem:  
Visueel systeem waarbij murals pas zichtbaar worden wanneer ze bezocht zijn  
[Lijnen 372–396]

---

## Styling & Layout

- CSS Grid:  
  Voor een responsieve galerij zonder complexe media queries.

- Flexbox:  
  Gebruikt voor navigatie, knoppen en modal-layout.

- Design System:  
  Gebruik van CSS-variabelen voor consistente styling en implementatie van Dark Mode.

---

## Installatie

1. Download of clone de GitHub repository  
2. Zorg dat de structuur behouden blijft:
   - index.html  
   - style.css  
   - script.js  
   - /img map  
3. Open het project via een lokale server (bijv. Live Server in VSCode)  

---

## Team & Taakverdeling

Dit project werd gerealiseerd in teamverband, met een gedeelde basisontwikkeling en een verdeling van hoofdverantwoordelijkheden per onderdeel.

- **Yassmine:**  
  UI-uitwerking, zoek- en filterervaring, favorietenlogica en de visuele uitwerking van de interface.

- **Selma:**  
  Applicatielogica, API-koppeling (`fetch` / `async-await`), gegevensbeheer met LocalStorage, uitbreiding van de meertaligheid, sorteerlogica, validatie in de modal, scrapbook-logica en technische debugging.

Beide teamleden hebben daarnaast bestaande onderdelen herwerkt, getest en verbeterd waar nodig om tot een coherent eindresultaat te komen.

## Gebruik van AI

AI-tools werden ingezet ter ondersteuning van:

- Code-optimalisatie  
- Architecturale keuzes  
- Debugging  

Chatlogs:

- Selma (Gemini):  
  https://gemini.google.com/share/c907342c542e  

- Yassmine (Gemini):  
  https://g.co/gemini/share/eb26f3957dfb  

Aanvullende zoekopdrachten via ChatGPT werden uitgevoerd door Yassmine zonder account, waardoor deze interacties niet konden worden opgeslagen of gereproduceerd.
