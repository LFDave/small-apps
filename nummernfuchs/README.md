# Nummernfuchs

Merk dir Nummern und Codes: eine kleine Lern-App für Kinder.

Kinder lernen damit echte Nummern auswendig: den Türcode, Mamis
Handynummer (auch international mit +41) und die Schweizer
Notfallnummern (112, 117, 118, 144, 145, 1414).

## So funktioniert es

1. Eine Nummer speichern und mit Leerzeichen in Sprech-Gruppen teilen,
   zum Beispiel `640 132` oder `079 640 13 21`.
2. Üben: Die App zeigt die Nummer, dann verschwindet Gruppe um Gruppe,
   bis das Kind die ganze Nummer aus dem Kopf tippt.
3. Notfallnummern: kurze Situationen ("Es brennt."), das Kind tippt die
   richtige Nummer.

Alle Nummern bleiben auf dem Gerät (localStorage). Keine Konten, kein
Tracking, keine externen Anfragen.

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
