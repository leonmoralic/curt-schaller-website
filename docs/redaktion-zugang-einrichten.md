# Redaktionszugang einrichten (für Leon)

Ziel: Curt bearbeitet cos-cam.com/admin, ohne selbst ein GitHub-Konto zu
brauchen. Dafür gibt es ein eigenes Redaktionskonto, dessen Zugangsschlüssel
Curt bekommt.

**Wichtig:** Es muss ein **klassischer** Token sein (Tokens (classic)).
Fein abgestufte Tokens greifen nur auf Repos zu, die dem Token-Konto selbst
gehören — das Redaktionskonto ist hier aber nur Mitarbeiter. Ein fein
abgestufter Token liefert stumm einen 404.

## A. Redaktionskonto anlegen

1. Abmelden oder privates Fenster öffnen (sonst legst du es unter deinem
   eigenen Konto an).
2. https://github.com/signup
3. E-Mail-Adresse, auf die du wirklich zugreifen kannst — z. B.
   `redaktion@cos-cam.com`. GitHub schickt einen Bestätigungscode.
4. Benutzername, z. B. `cos-cam-redaktion`. Passwort in Proton Pass ablegen.
5. **Zwei-Faktor-Anmeldung einrichten** — GitHub verlangt das für alle Konten,
   die Code beitragen. Den TOTP-Schlüssel ebenfalls in Proton Pass ablegen
   (Proton Pass kann die Codes selbst erzeugen). Curt braucht diesen zweiten
   Faktor nie; er arbeitet nur mit dem Zugangsschlüssel.

## B. Konto zum Repo einladen (aus deinem eigenen Konto)

1. https://github.com/leonmoralic/curt-schaller-website
2. **Settings** → links **Collaborators**
3. **Add people** → Benutzername des Redaktionskontos → Rolle **Write**
4. Ins Redaktionskonto wechseln, Einladungsmail öffnen, **Accept** klicken.
   Ohne diesen Schritt ist der Zugang nicht aktiv.

## C. Zugangsschlüssel erzeugen (im Redaktionskonto)

1. Oben rechts auf das Profilbild → **Settings**
2. Ganz unten in der linken Spalte → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. **Note:** `cos-cam Redaktion Curt`
6. **Expiration:** 1 Jahr, und dir eine Erinnerung in den Kalender setzen.
   Alternativ „No expiration" — dann kann Curt nicht plötzlich ausgesperrt
   werden, dafür ist der Schlüssel unbegrenzt gültig, falls er abhandenkommt.
7. **Scopes:** nur **`repo`** ankreuzen. Sonst nichts.
8. **Generate token** → Der Schlüssel (`ghp_…`) wird **nur ein einziges Mal**
   angezeigt. Sofort in Proton Pass speichern, in einen Tresor, den du mit
   Curt teilst.

## D. An Curt übergeben

Schlüssel plus `docs/redaktion-anleitung.md`. Er ruft cos-cam.com/admin auf,
klickt **Sign In Using Access Token**, fügt ihn ein — fertig.

## Wenn es einmal mehr Redakteure werden

Dann Repo in eine GitHub-Organisation überführen (kostenlos). Dort funktionieren
fein abgestufte Tokens, jeder bekommt einen eigenen Zugang, und Rechte lassen
sich einzeln entziehen. Für einen Redakteur lohnt der Aufwand nicht.

## Zurückziehen

Zugang sperren: im Redaktionskonto unter Tokens (classic) den Schlüssel löschen.
Wirkt sofort. Alternativ das Konto unter Collaborators aus dem Repo entfernen.
