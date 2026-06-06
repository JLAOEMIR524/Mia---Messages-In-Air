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
Wenn der User noch überhaupt keine Postkarten gesendet oder empfangen hat, darf die App nicht crashen oder unendlich laden. Der test
prüft, ob die Komponente den Text "No postcards found in this category." rendert.

