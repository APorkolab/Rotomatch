# MatchingGameAngular

Your task is to build a simple card-matching game, the kind that your brother/sister/best friend always cheated at when you were little. In case you need a reminder, here’s how it should work:

1.  Present the user with an even number of cards, “face down”.
2.  When the user clicks a card, “flip it over” and reveal the hidden image.
3.  When two cards are revealed:

    1.  If the cards are identical, remove them from play.
    2.  If they are not, flip them back.

4.  The game ends when all the cards are removed.

To get full points, your app should also fulfill all of the below requirements:

- It should be responsive.
- It should have a landing page for the app that explains the rules, and a separate screen for the actual game.
- We expect a SPA.
- Allow the user to play more than one game without reloading the page.
- Allow the user to set the number of cards before a new game (min. 3, max. 10 pairs).
- Present the user with a step counter that increments after every second card flip.
- Allow the user to continue the previously played game after reloading the page.

We have attached some assets and a basic UI design scheme; implement them as closely as possible. Aside from that, use any framework. This is your project. Just make it happen.

You need to deliver a working game that we can play through until the end, otherwise, we can’t evaluate your submission. It doesn’t have to be perfect but it cannot contain game-breaking bugs.

We’ll be expecting your submission via a GitHub link. _Please commit regularly, at least after each feature while you work._

You have five hours, starting now.

Evaluation:

"A feladat megvalósítása közben több feature implementálása sem történt meg vagy hibásan lett megvalósítva, ilyen pl.:

- Deck választó
- Játék állapot mentése (localStorage használata pl.)

A UI szépen lett megvalósítva, többé kevésbé követte a feladatban elvártakat és igazodott a mintaként küldött felülethez, emellett a csatolt anyagokat is felhasználta és a reszponzív megjelenés is támogatott volt (itt néhol voltak elcsúszó elemek).
A választott keretrendszer (Angular) ugyan jó döntés volt a feladat megoldására, viszont a routing teljes mellőzése nagyon bad practice. Emiatt egyetlen fő komponensbe lett összezsúfolva az összes page.

A styling ugyan Sass-t használt viszont az implementációban egyáltalán nem voltak kihasználva az adottságait, gondolok itt pl.: nesting.
Ugyan a TypeScript használata megvalósult viszont rengeteg helyen volt any illetve sok helyen hiányoztak call signiture-ök emellett nincsenek interface-ek, enum-ok használva."
