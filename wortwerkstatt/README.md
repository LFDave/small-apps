# Wortwerkstatt

Rechtschreibung üben, Regel für Regel: eine kleine Lern-App für Kinder.

Die Übungen folgen einer Kompetenz aus dem Lehrplan 21: **D.4 Schreiben,
D.4.F.1** (Text in Bezug auf Rechtschreibung und Grammatik überarbeiten),
Fassung Kanton Bern vom 23.06.2016. Jede Regel zeigt, aus welchem
Kompetenzschritt sie stammt. Wo eine Regel nicht im Lehrplan-Text steht,
sagt die App das auch.

Zyklus 1 ist die 1. und 2. Klasse, Zyklus 2 die 3. bis 6. Klasse,
Zyklus 3 die 7. bis 9. Klasse. Manche Regeln laufen über zwei Zyklen und
stehen darum auf beiden Listen.

## So funktioniert es

1. Zyklus wählen (Voreinstellung: Zyklus 1). Jeder Zyklus hat seine
   eigenen Regeln.
2. Eine Regel antippen. Dort steht die Regel zum Nachlesen, dazu drei
   Kapitel.
3. **Kapitel 1, Zum Aufwärmen**: häufige Wörter, Antwort antippen.
   **Kapitel 2, Schon schwieriger**: seltenere Wörter, Antwort antippen.
   **Kapitel 3, Selber schreiben**: gleiche Regel, aber selber tippen.
4. Eine Runde sind sechs Aufgaben. Am Ende schlägt die App gleich das
   nächste Kapitel vor.
5. Beim Schreiben siehst du beim letzten Zeichen sofort, ob es stimmt.
   Kein Bestätigen-Knopf.
6. Nach der Antwort erscheint die Regel. Vorher wäre sie nur eine
   Tabelle zum Abschreiben.
7. Für jede Runde gibt es XP, Levels (vom Schreiblehrling zur
   Meisterfeder) und Medaillen. Fehler kosten nichts, Tempo zählt nicht.

Klappen fünf Runden hintereinander ohne Fehler, schlägt die App den
nächsten Zyklus vor. Sie wechselt nie von selbst, und kein Kapitel ist
je gesperrt.

## Texte schreiben

Ein zweiter Modus, in dem nichts angetippt wird. Du schreibst einen
ganzen Text richtig auf, Satz für Satz. Der Text steht als schnell
getippter Entwurf da, ganz klein geschrieben und ohne Satzzeichen. Du
setzt die grossen Buchstaben, die Satzzeichen und die Kommas.

Der Text wächst dabei vor deinen Augen: Was du geschrieben hast, steht
schon richtig da, der Satz an der Reihe ist hervorgehoben, der Rest
wartet noch.

Neun Texte, drei pro Zyklus, 42 Sätze. Jeder Text sagt auf der Karte,
welche Regeln er zusammenbringt. Zyklus 1 mischt Satzanfang, Nomen und
Satzschlusszeichen, Zyklus 2 nimmt Kommas dazu, Zyklus 3 Nebensätze und
Nominalisierung.

## Regeln in der App

22 Regeln, 66 Kapitel, 484 Aufgaben, dazu 9 Texte mit 42 Sätzen.

- **Zyklus 1**: Nomen gross, Satzanfang, Wortgrenzen, Merkwörter,
  Satzschlusszeichen, sch, sp und st, ng und nk, abstrakte Nomen.
- **Zyklus 2**: ie, e und ä, Komma bei Aufzählungen, Wortstamm,
  doppelte Mitlaute, Komma beim Nebensatz, Endungen heit/keit/ung,
  Merkwörter. Dazu die fünf Regeln aus Zyklus 1, die über beide Zyklen
  laufen.
- **Zyklus 3**: lange Selbstlaute, Nominalisierung, das und dass,
  Endungen ig/lich/isch, Fremdwörter.

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
