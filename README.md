consolePoker
============

I'm currently trying to learn JavaScript / JQuery etc. with the goal of getting a job 
in web development.  I'll be doing some small projects to get my feet wet with the 
language, and then tackle one or two substantial projects before moving onto learning 
Ruby / Rails.

consolePoker: 
Partial implementation of a Texas Hold em poker game.
Implemented so far:
-Create poker table objects with a deck of cards and that can seat up to 6 players.
-Players are this point are objects that can hold (2) cards and have non-unique names
-Deck shuffling
-Deal cards to everyone at the table.  Deal flop, turn, river.
-View class that displays the players at the table and cards on the table as text.
-Linked list class with methods that enable the easy coding of methods for determining
the order of players actions.  Currently this is used for dealing cards and showing the
players and their positions.
-Demo class to show current capabilities
-Got my first experience implementing a closure with the Table() constructor (counts the
number of tables already constructed to give an ID to each table).
-Positions (SB, BB, button, etc.) display correctly for tables with anywhere from two
to six players.
-Players can be added dynamically between hands.

Next steps:
-chip stacks
-betting rounds
-determination of hand value (pair, three of kind, etc.) on flop, turn, river.
-dealing with finite chip stacks (poses a number of complications when a player is all
in)
-AI
-No plans for players controls on the console (most I would do is have the AI play
each other)
-Extend this program to a web implementation (single player against AI), graphics

No definite plans to implement any of these, but I am thinking that a fully functional
web version of hold em with a few AI types would be a fun project.