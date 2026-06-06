# Testdoku
## Dashboard Helpers (Unit Tests)
### Was haben wir geändert?
Problem: Berechnungslogik (Filtern, Sortieren, Länder zählen) war hart in Dashboard.tsx gecodet. Um das dort zu testen, müssten wir React-DOM, Router, Mocks und Sessions mitladen.......

Lösung: Ganze Logik rausgeschmissen und als Pure Functions in eine eigene Datei ausgelagert: frontend/utils/dashboardHelpers.ts.

Vorteil: Wir können die Core-Logik jetzt isoliert, schneller und ohne UI-Ablenkung über Unit Tests prüfen

Commit: a2156695f839ae02921149fa652772ef80d12e79

## Was haben wir getestet? (Edge Cases)
Edge Case 1: Checkt, ob das System kapiert, dass location: "Berlin, Germany" und location: "Germany" dasselbe Land sind (Statistik muss genau 1 anzeigen).

Edge Case 2: Erkennung, wenn das Backend den Ländernamen schon extra mitgibt (z. B. location: "Berlin", countryName: "Germany").

## Gallery Component
### Was haben wir geändert?
Die React-Leaflet-Karte (<MapContainer />) crasht in JSDOM-Testumgebungen, weil JSDOM keine echten Element-Größen berechnen kann.
Wir haben Leaflet komplett über vi.mock mit einfachen HTML-Platzhaltern gestunnt.

Was wurde getestet? (Edge Cases)
- Test 1: Wenn der User noch überhaupt keine Postkarten gesendet oder empfangen hat, darf die App nicht crashen oder unendlich laden. Der test prüft, ob die Komponente den Text "No postcards found in this category." rendert.
- Test 2: Überprüft, ob die Komponente Postkarten aus der API korrekt verarbeitet und die Texte (z. B. "Grüße aus Salzburg", "Hallo vom Strand") sichtbar auf dem Bildschirm anzeigt.
- Test 3: Filter-Logik über Buttons. Nach dem Klick auf den "Sent"-Filter über userEvent.click() darf nur noch die gesendete Postkarte im DOM existieren, während die empfangene Karte aus der Übersicht weg muss.
- Test 4: Da die Postkarten-Wrapper interaktive Elemente mit role="button" sind, müssen sie sich barrierefrei bedienen lassen. Der Test fokussiert die Karte, simuliert das Drücken der Leertaste (user.keyboard(" ")) und prüft über das Attribut aria-pressed="true", ob die Karte erfolgreich umgedreht wurde.

Commit: e3e9cf9eb832854091e3b3020a8544b015765d46 & 15b3e28b2230afc1ff4e5df7c56c7f5b213c7088

## Profile Component
### Was wurde getestet
- Test 1: Der Test erzwingt über fetchSpy.mockRejectedValueOnce() einen Netzwerkfehler, um zu überprüfen, ob die Fehlermeldung "Profile data could not be loaded. Please try again later." korrekt anzeigt wird.
- Test 2: Der Test simuliert erfolgreiche API-Antworten für Stats, Sticker sowie Quests und prüft, ob die User-Daten (Name, E-Mail mittels flexibler Regex) korrekt im DOM landen und die UI-Komponenten ordnungsgemäß gerendert werden.
- Test 3: Es wird überprüft, ob bei einem leeren Quest-Array der vordefinierte Empty-State-Text "You haven't completed any quests yet. Send a postcard to start!" erscheint.
- Test 4: Prüft die korrekte Filterung und Trennung der Sticker im Frontend, indem er schaut, ob freigeschaltete Sticker (isLocked: false) barrierefrei als Bild (role="img") und gesperrte Sticker (isLocked: true) als Interaktions-Button (role="button") ausgegeben werden.

Commit: 46745f64e9095fce98885e433adb76af97fc0463 & ff078bbe43053e065161e4874bd6ec272e5ee288


## Quest Component
### Was wurde getestet?
- Test 1: Der Test stellt sicher, dass der Weiter-Button blockiert ist und die visuelle Warnung "Please select a quest to continue" anzeigt wird, solange keine Quest gewählt wurde.
- Test 2: Überprüft die State-Transition bei einer User-Interaktion; klickt der User auf eine alternative Quest-Karte, verschwindet die Validierungswarnung und der Weiter-Button wird freigeschaltet.
- Test 3: Kontrolliert, ob die ausgewählte Quest beim Klick auf den Button als JSON-String im Local Storage hinterlegt wird.
- Test 4: Bestätigt, dass der "Choose this Quest"-Button innerhalb der primären Quest-Karte den Validierungs-Schritt überspringt, die Karte sofort im LocalStorage speichert und den User direkt an den `/editor` weiterleitet.
- Test 5: Simuliert die Interaktion mit dem Reload-Button und verifiziert, dass die App die fokussierte Quest erfolgreich austauscht und den UI-Inhalt für den User sichtbar aktualisiert.

Commit: 626bc24e9bddc4c23bdc04b67b7e98a941c6dba2 & 694368a09125e3ce93f145a5a5c473d3b410334d

### Schwierigkeit dabei:
Die Quest sind "Unvorhersebar. Weil Math.random() jedes Mal anders ist, wussten wir nie, welche Quest beim Testen als aktive Hauptquest oben landet. Der Test war also ein reines Glücksspiel und ist ständig random fehlgeschlagen.

Um das zu fixen, haben wir Math.random() im beforeEach fest auf 0.1 gesetzt. Dadurch wurde die Sortierung zwar stabil, aber irgendiwe komisch: Durch den festen Wert rutschte plötzlich immer standardmäßig Quest Vier nach oben, was wir erst mal durch Suchen herausfinden mussten.

**Der Reload-Button**
Der Button soll die Quests ja neu mischen. Da Math.random() durch unser Setup aber wie eingefroren auf 0.1 stand, passierte beim Klick auf den Button visuell überhaupt nichts. Die Quests blieben in exakt derselben Reihenfolge und die alte Hauptquest blieb oben kleben.
Lösung: Wir mussten tricksen und dem Mock sagen: Beim ersten Laden gibst du 0.1 aus (damit Quest Vier oben steht), aber sobald der User auf den Reload-Button klickt, gibst du 0.9 aus. Durch diesen kontrollierten Tausch der Werte wurde das Array im Testlauf deterministisch neu sortiert. Quest Vier rutschte dadurch nach unten in die weiteren Quests, sodass wir die veränderte Reihenfolge erfolgreich mittels queryByRole überprüfen konnten.
-> Siehe issue 694368a09125e3ce93f145a5a5c473d3b410334d

## Editor Component
### Was wurde getestet?
-Test 1: Der Test stellt sicher, dass der Weiter-Button blockiert ist und die visuelle Warnung "Please add some content to your postcard to continue" angezeigt wird, solange das Postkarten-Array komplett leer ist, also wenn noch keine Sticker oder Fotos auf der Karte sind.

Test 2: Überprüft, ob beim Klick auf die verschiedenen Buttons (Photos, Stickers, Background) die entsprechende CSS-Klasse button--selected dynamisch vergeben bzw. entzogen wird, um dem User den aktiven "Modus" visuell anzuzeigen.

- Test 3 & 4: Getestet wird sowohl der "Happy Path" (erfolgreiche API-Antwort, Speichern der Canvas-Daten im LocalStorage und korrekte Weiterleitung) als auch der "Unhappy Path" (Erkennung unangemessener Inhalte), bei dem die Navigation blockiert und eine entsprechende Fehlermeldung via ARIA-Live-Response (`role="alert"`) ausgegeben wird.

- Test 5, 6 & 7: Verifiziert die Registrierung der globalen Keydown-Events. Es wird simuliert, ob bei einem selektierten Element die Shortcuts für das Löschen (`Backspace`/`Delete`), das Verschieben der Bildebenen (`F`/`B`) und das Deselektieren (`Escape`) die jeweils korrekten Funktionen des `usePostcard`-Hooks fehlerfrei auslösen.

### Schwierigkeit dabei:
- virtuelle Browser-Umgebung (JSDOM): JSDOM kennt manche moderne Browser-Funktionen einfach nicht. Meine Popup-Komponente hat window.matchMedia() aufgerufen, um abzufragen, ob der User Animationen reduziert haben möchte. Da JSDOM diese Funktion nicht besitzt, stürzte der komplette Test mit einem TypeError ab. Wir mussten dem Testfenster manuell beibringen, was matchMedia ist (ein sogenannter Polyfill oder Global Mock).
- Für den API-Test mussten wir die Zeit manipulieren (vi.useFakeTimers()), um nicht echte 4 Sekunden warten zu müssen, bis die Weiterleitung passiert.
Das Problem: Das moderne userEvent wartet nach einem Klick darauf, dass der Browser Events verarbeitet. Die Tests liefen in eine Endlosschleife und brachen nach 5 Sekunden mit einem Timeout ab. Die Lösung war der Wechsel auf fireEvent.click(), das den Klick einfach direkt und synchron ins DOM schießt, ohne auf die Zeitschleife zu achten.
- Die Editor-Komponente nutzt useRef, um direkt auf das Canvas zuzugreifen und das Bild per .toDataURL() zu exportieren.
In einem Test existiert dieses Canvas gar nicht richtig. Wenn der Code versucht, das Bild zu exportieren, schlug das fehl mit der Meldung: Moderation error: No stage Detected. Weil kein Canvas da war, wurde localStorage mit null befüllt, und der Test schlug fehl. Wir mussten React.useRef und die Canvas-Komponente mocken, damit der Editor glaubt, er hätte gerade ein echtes Bild exportiert.

Commit: 9f16ded04d76ea5cac16abdef7fee02312d4e188 & 88f961b9ccf65177034fa184204dc81198f2a313

## Send Komponente
### Was wurde getestet? 
- Test 1: Test simuliert den "Happy Path", bei dem die Komponente korrekte Analysedaten über den `location.state` des React-Routers übergeben bekommt. Es wird sichergestellt, dass die XP-Menge korrekt gerendert, das Sterne-Rating mathematisch richtig gerundet (`80%` $\rightarrow$ `4 von 5 Sternen`) und ein persistentes Backup im `sessionStorage` angelegt wird.
- Test 2:  Simuliert Anwendungsfall, bei dem der User die Seite im Browser neu lädt. Da hierbei der flüchtige Router-State verloren geht (`null`), wird überprüft, ob die Komponente stabil bleibt und die Daten stattdessen fehlerfrei aus dem zuvor angelegten `sessionStorage`-Backup liest.
- Test 3: Überprüft das Verhalten beim Verlassen der Seite über den Button "Back to Dashboard". Der Test stellt sicher, dass beim Klick der `sessionStorage` geleert wird, um alten Datenmüll zu vermeiden und anschließend eine saubere Weiterleitung zum Dashboard stattfindet.
- Test 4:  Verifiziert, dass beim Klick auf "View Details" die `useNavigate`-Funktion mit dem korrekten Pfad (`/details`) aufgerufen wird und das aktuelle Analyse-Objekt im neuen Router-State vollständig mitgegeben wird.

### Schwierigkeit dabei:
Die eingebundene Komponente `<Confetti />` steuert visuelle Effekte bei und horcht auf globale Window-Resize-Events, um sich dynamisch anzupassen. In JSDOM führt dies zu unnötigem Performance-Overhead und potenziellen Timeouts, da Layout-Berechnungen simuliert werden müssen. Als Lösung wurde die gesamte `react-confetti`-Bibliothek mittels `vi.mock()` durch eine schlankere Mock-Komponente ersetzt, da sie für die eigentliche Business-Logik irrelevant ist.

Commit: 4b8c4bae5877decc608fdc8e58caad8ec1eecfc2

## Details Component
### Was wurde getestet?
- Test 1: Überprüft, ob alle verschachtelten Metriken des Analyse-Ergebnisses (`length`, `badWords`, `capitalization`, `punctuation`) fehlerfrei ausgelesen und formatiert dargestellt werden. Zudem wird sichergestellt, dass das Array für die erfüllten Quests (`questFulfillment`) korrekt gemappt und ausgegeben wird.
- Test 2:  Stellt sicher, dass die Komponente bei einem direkten Seiten-Reload stabil bleibt. Falls der flüchtige Router-State verloren geht (`null`), greift die Komponente erfolgreich auf das im `sessionStorage` hinterlegte JSON-Backup zurück.
- Test 3: Testet das Defensiv-Verhalten der Komponente für den Fall, dass weder im Router-State noch im `sessionStorage` Daten auffindbar sind. Es wird verifiziert, dass die Komponente nicht abstürzt, sondern vordefinierte Fallback-Werte (`0/5` bzw. `+0 XP`) rendert und die Quest-Sektion komplett ausblendet.
- Test 4: Überprüft den `onContinue`-Handler der eingebundenen `FeedbackCard`. Sobald der User die Detailansicht über den Button schließt, wird der temporäre Speicher (`sessionStorage`) geleert, um alte Daten der vorherigen Postkarten-Session zu löschen.

### Schwierigkeit dabei:
Im `onContinue`-Handler der Komponente wird die Navigation hart über `window.location.href = "/dashboard"` erzwungen. In JSDOM führt das direkte Überschreiben oder Löschen dieses Read-Only-Objekts zu strengen TypeScript-Fehlern. Die Lösung war der Einsatz von `vi.stubGlobal("location", mockLocation)`. Dadurch lässt sich das globale Objekt typsicher manipulieren und im `beforeEach`-Block über `vi.unstubAllGlobals()` vor jedem Testlauf automatisch wieder sauber aufräumen.

Commit: 

