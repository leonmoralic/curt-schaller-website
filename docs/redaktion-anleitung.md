# Website selbst bearbeiten — Anleitung

Für Curt. Die Website cos-cam.com lässt sich vollständig ohne Entwickler
bearbeiten. Es gibt einen Editor mit Eingabefeldern, kein Programmieren.

## Einmalig einrichten

Du brauchst kein GitHub-Konto und musst dich nirgends registrieren.

Leon gibt dir einen **Zugangsschlüssel** — eine lange Zeichenfolge, die mit
`ghp_` beginnt. Bewahre sie auf (Passwortmanager oder ausgedruckt im
Schreibtisch), du brauchst sie nur selten, aber dann sicher.

## Anmelden

1. **https://cos-cam.com/admin** aufrufen (am besten als Lesezeichen setzen).
2. Auf **Sign In Using Access Token** klicken — den unteren der beiden Knöpfe,
   nicht „Sign In with GitHub".
3. Den Zugangsschlüssel einfügen und bestätigen.

Der Browser merkt sich die Anmeldung. Beim nächsten Mal geht es direkt weiter.

Nach dem Schlüssel gefragt wirst du wieder, wenn du den Browser wechselst, ein
anderes Gerät benutzt oder die Browserdaten gelöscht hast. Dann einfach erneut
einfügen. Wenn du ihn nicht mehr findest, hat Leon ihn.

## Bearbeiten

1. Links stehen die Bereiche der Website:
   - **Startseite (Kopfbereich)** — Überschrift, Kennzahlen, Foto, Einleitung
   - **01 Vita** — Zeitleiste und Fließtext
   - **02+03 Erfindungen und Patente** — Erfindungen, Patentfamilien
   - **04 Heute** — Workshops, Consulting, Talks
   - **05 Kontakt** — Anschreiben, E-Mail-Adresse
2. Bereich anklicken, Felder ausfüllen, **Save** drücken.
3. Nach etwa zwei Minuten ist die Änderung auf cos-cam.com sichtbar.
   Falls nicht sofort: Seite mit Cmd+Umschalt+R (Windows: Strg+Umschalt+R)
   neu laden, der Browser hält die alte Fassung manchmal fest.

## Wenn oben eine Leiste erscheint

Nach dem Speichern baut die Website sich neu auf. Oben im Editor siehst du
dazu eine Leiste:

- **Grau** — die Website wird gerade neu erstellt, etwa zwei Minuten.
- **Grün** — fertig, deine Änderung ist auf cos-cam.com zu sehen.
- **Rot** — die Veröffentlichung ist fehlgeschlagen. Deine Arbeit ist
  gespeichert und nicht verloren, sie ist aber **nicht** auf der Website.
  Bitte gib in diesem Fall Leon Bescheid und arbeite nicht weiter, bis er
  sich gemeldet hat.

Die rote Leiste ist wichtig: Ohne sie merkt man nicht, dass Änderungen
liegenbleiben.

## Die Website danebenlegen

Unten rechts sitzt der Knopf **Website ansehen**. Er blendet die echte
Website rechts neben dem Editor ein und springt automatisch zu dem
Abschnitt, den du gerade bearbeitest. Oben im Rahmen kannst du zwischen
**DE** und **EN** umschalten und die Seite **neu laden**. Die linke Kante
lässt sich ziehen, wenn dir der Rahmen zu breit oder zu schmal ist.

Wichtig: Dieser Rahmen zeigt die **veröffentlichte** Seite. Was du gerade
tippst und noch nicht gespeichert hast, steht dort noch nicht drin. Nach dem
Speichern etwa zwei Minuten warten und auf **Neu laden** klicken.

## Deutsch und Englisch

Die Seite gibt es zweisprachig. Der Editor zeigt beide Sprachen
nebeneinander — du füllst links Deutsch aus, rechts Englisch.

Manche Felder gibt es nur einmal, weil sie in beiden Sprachen gleich sein
müssen: Jahreszahlen, Patentnummern, die E-Mail-Adresse und das Foto. Diese
änderst du einmal, und beide Sprachfassungen übernehmen den Wert.

## Statue an einer Station

Bei jeder Station der Zeitleiste kannst du unter **Auszeichnung an dieser
Station** wählen, ob dort eine Statue erscheint — Oscar oder Emmy. Sie taucht
auf, sobald ein Besucher bis dorthin scrollt. Setze sie nur bei den Stationen,
an denen die Auszeichnung tatsächlich verliehen wurde.

## Schriftart der Website

Unter **Gestaltung → Schriftart** lässt sich die Schrift der ganzen Website
umstellen. Zur Wahl stehen:

- **Fraunces** — die Serifenschrift, mit der die Seite gestaltet wurde.
- **Inter Tight** — eine serifenlose Alternative.

Ein Hinweis dazu, weil er sich nicht von selbst erschließt: Fraunces hat
eine echte Kursive, Inter Tight nicht. Alle kursiv gesetzten Stellen — und
davon lebt das Layout an vielen Stellen — werden mit Inter Tight vom Browser
nur schräg gestellt statt richtig kursiv gesetzt. Das sieht sichtbar
schlechter aus. Schau dir die Umstellung deshalb in der Web-Vorschau an,
bevor du sie stehen lässt; zurückstellen geht jederzeit.

Patentnummern und Kapitelziffern bleiben in beiden Fällen unverändert.

## Was du beachten solltest

**HTML in Texten.** In einigen Überschriften stehen Zeichenfolgen wie
`<em>` und `</em>`. Der Text dazwischen wird auf der Website kursiv
dargestellt. Beispiel:

    Vom Bavaria-Studio <em>zum Oscar.</em>

Du darfst den Text ändern. Lösche aber die spitzen Klammern nicht und achte
darauf, dass zu jedem `<em>` ein `</em>` gehört. Sonst rutscht die
Darstellung. Dasselbe gilt für `<span class="hl">…</span>` (goldene
Hervorhebung).

**Das Foto auf der Startseite.** Der OSCARS-Schriftzug hinter dir ist Teil
der Bilddatei, kein eigenes Element. Wenn du ein neues Foto hochlädst, auf
dem nur du zu sehen bist, verschwindet der Schriftzug. Vor einem Bildwechsel
also bitte kurz bei Leon melden.

**Nichts kann kaputtgehen.** Der Editor zeigt dir nur Inhaltsfelder. Layout,
Farben und Animationen kannst du gar nicht erreichen. Und falls doch einmal
etwas nicht zusammenpasst, wird die Änderung nicht veröffentlicht — die
Website bleibt so online, wie sie war.

## Was weiterhin über Leon läuft

Neue Abschnitte, Änderungen am Layout oder Design, neue Arten von Feldern,
Animationen.

## Wenn etwas nicht klappt

Änderung gespeichert, aber nach zehn Minuten nicht sichtbar: bei Leon melden.
Er sieht im Projekt, woran es lag.

Der Editor fragt nach dem Zugangsschlüssel und deiner passt nicht mehr: Der
Schlüssel läuft nach einer festgelegten Zeit ab. Leon stellt dir dann einen
neuen aus, das dauert zwei Minuten.
