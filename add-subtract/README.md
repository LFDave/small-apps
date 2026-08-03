# Mathe-Trainer

Plus und Minus üben. Ruhig, ohne Zeitdruck, ohne Konto. Der Fortschritt bleibt auf dem Gerät.

**Öffnen:** [lfdave.github.io/small-apps/add-subtract](https://lfdave.github.io/small-apps/add-subtract)

## Benutzung

1. Rechenart und Zahlenbereich wählen, dann "Los geht's".
2. Antwort über den Ziffernblock oder die Tastatur eintippen. Bei der letzten Ziffer siehst du sofort, ob es stimmt.
3. "Rechenweg zeigen" öffnet jederzeit einen Tipp in kleinen Schritten: 42 − 7 geht über die 40, 82 − 29 rundet auf 30 und gibt 1 zurück, 25 − 17 zählt hinauf. Der letzte Schritt bleibt offen, das Ergebnis rechnest du selbst. Der Tipp kostet nichts.
4. "Weiter" führt zur nächsten Aufgabe.

"Alles zurücksetzen" unten auf der Startseite löscht XP, Medaillen und gelöste Aufgaben. Die Einstellungen bleiben, und gefragt wird vorher.

## Lokal ausführen

```bash
python3 -m http.server
```

Dann http://localhost:8000/ öffnen.

## Tests

```bash
cd tests && npm install && node e2e.test.mjs
```
