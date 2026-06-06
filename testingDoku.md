# Testdoku
## Dashboard Helpers (Unit Tests)
### Was haben wir geändert?
Problem: Berechnungslogik (Filtern, Sortieren, Länder zählen) war hart in Dashboard.tsx gecodet. Um das dort zu testen, müssten wir React-DOM, Router, Mocks und Sessions mitladen.......

Lösung: Ganze Logik rausgeschmissen und als Pure Functions in eine eigene Datei ausgelagert: frontend/utils/dashboardHelpers.ts.

Vorteil: Wir können die Core-Logik jetzt isoliert, schneller und ohne UI-Ablenkung über Unit Tests prüfen

Commit: 

## Was haben wir getestet? (Edge Cases)
Edge Case 1: Checkt, ob das System kapiert, dass location: "Berlin, Germany" und location: "Germany" dasselbe Land sind (Statistik muss genau 1 anzeigen).

Edge Case 2: Erkennung, wenn das Backend den Ländernamen schon extra mitgibt (z. B. location: "Berlin", countryName: "Germany").