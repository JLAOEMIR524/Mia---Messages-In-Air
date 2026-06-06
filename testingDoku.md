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

