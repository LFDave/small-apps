# Nummernfuchs

Merk dir Nummern und Codes: eine kleine Lern-App für Kinder.

Kinder lernen damit echte Nummern auswendig: den Türcode, Mamis
Handynummer (auch international mit +41) und die Notfallnummern ihres
Landes.

## So funktioniert es

1. Eine Nummer speichern und mit Leerzeichen in Sprech-Gruppen teilen,
   zum Beispiel `640 132` oder `079 640 13 21`.
2. Üben: Die App zeigt die Nummer, dann verschwindet Gruppe um Gruppe,
   bis das Kind die ganze Nummer aus dem Kopf tippt.
3. Notfallnummern: kurze Situationen ("Es brennt."), das Kind tippt die
   richtige Nummer.
4. Zufallszahl: Training mit zufälligen Zahlen in wählbarer Länge
   (3 bis 16 Ziffern). Am Ende wartet gleich die nächste Zahl. Klappt
   es fünfmal hintereinander ohne Fehler, schlägt die App eine Ziffer
   mehr vor.
5. Für jede Übung gibt es XP, Levels (vom Fuchswelpen zum Meisterfuchs)
   und Medaillen. Fehler kosten nichts, Tempo zählt nicht.

## Einstellungen

Über das Zahnrad oben rechts:

- **Sprache**: Deutsch (Standard), Français, Italiano, Rumantsch,
  English. Die Wahl bleibt gespeichert.
- **Land**: Schweiz (Standard), Deutschland, Österreich, Frankreich,
  Italien, Liechtenstein, Norwegen. Das Land bestimmt die
  Notfallnummern und die Landesvorwahl für neue Telefonnummern.

Wo ein Land für etwas keine kurze Notrufnummer hat, sagt die App das
und erklärt, was man stattdessen wählt. Sie erfindet keine Nummer.

Alle Nummern und Einstellungen bleiben auf dem Gerät (localStorage).
Keine Konten, kein Tracking. Die einzige externe Anfrage sind die
Landesflaggen von flagcdn; ohne Netz bleiben sie einfach weg.

## Starten

Statisch serven (ES-Module brauchen http), zum Beispiel:

```bash
python3 -m http.server
```

Dann `http://localhost:8000/nummernfuchs/index.html` öffnen.

## Tests

```bash
cd nummernfuchs/tests
npm install
node e2e.test.mjs
```

Spec: siehe `PRD.md` in diesem Ordner.
