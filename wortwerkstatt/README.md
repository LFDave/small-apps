# Wortwerkstatt

Rechtschreibung üben, Regel für Regel: eine kleine Lern-App für Kinder.

Die Übungen folgen den drei Zyklen des Lehrplans 21. Zyklus 1 ist die
1. und 2. Klasse, Zyklus 2 die 3. bis 6. Klasse, Zyklus 3 die 7. bis
9. Klasse.

## So funktioniert es

1. Zyklus wählen (Voreinstellung: Zyklus 2). Jeder Zyklus hat seine
   eigenen Regeln.
2. Eine Regel antippen oder gleich die gemischte Übung starten. Eine
   Runde sind sechs Aufgaben.
3. Bei den meisten Aufgaben fehlt etwas: Buchstaben in einem Wort
   (`Bei ··· iel`), ein Wort im Satz oder ein Satzzeichen. Das Kind
   wählt aus den Möglichkeiten.
4. Bei Merkwörtern zeigt die App das Wort, versteckt es und das Kind
   schreibt es aus dem Kopf. Beim letzten Buchstaben sieht es sofort,
   ob es stimmt.
5. Nach der Antwort erscheint die Regel. Vorher wäre sie nur eine
   Tabelle zum Abschreiben.
6. Für jede Runde gibt es XP, Levels (vom Schreiblehrling zur
   Meisterfeder) und Medaillen. Fehler kosten nichts, Tempo zählt
   nicht.

Klappen fünf Runden hintereinander ohne Fehler, schlägt die App den
nächsten Zyklus vor. Sie wechselt nie von selbst.

## Regeln in der App

- **Zyklus 1**: Nomen gross, Satzanfang, Punkt und Fragezeichen,
  Merkwörter.
- **Zyklus 2**: sch, sp und st, ng und nk, doppelte Mitlaute, lange
  Selbstlaute, abstrakte Nomen, Satzschlusszeichen, Merkwörter.
- **Zyklus 3**: das und dass, Nominalisierung, Komma beim Nebensatz,
  Endungen ig und lich, Fremdwörter.

## Einstellungen

Über das Zahnrad oben rechts:

- **Sprache**: Deutsch (Standard) und English. Das ist die Sprache der
  Bedienung und der Regelerklärungen.
- **Zyklus**: 1, 2 oder 3. Du kannst jederzeit wechseln.

Die Übungswörter bleiben deutsch, auch bei englischer Bedienung. Man
kann deutsche Rechtschreibung nicht mit englischen Sätzen üben.

Fortschritt und Einstellungen bleiben auf dem Gerät (localStorage).
Keine Konten, kein Tracking, keine externen Anfragen. Nach dem ersten
Laden funktioniert die App auch ohne Netz.

## Starten

Statisch serven (ES-Module brauchen http), zum Beispiel:

```bash
python3 -m http.server
```

Dann `http://localhost:8000/wortwerkstatt/index.html` öffnen.

## Tests

```bash
cd wortwerkstatt/tests
npm install
node e2e.test.mjs
```

Spec: siehe `PRD.md` in diesem Ordner.
