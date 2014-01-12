/*
 * Texas Holdem.  01/10/2014
 * Tom Conrad
 * For practice creating JS objects/classes
 * Supports multiple 6-max tables
 * Features coded so far:
 * Create Table, Deck, Player objects.
 * Show all player hole cards, show flop/turn/river. (all at once)
 * Shuffle deck, pass button around table each hand
 */
 
//****************GLOBALS****************//

//***************************************//

//**********Utility Functions************//
function _randInt(low,high) {
	r=null;
	while(r===null || r===0 || r===1) r=Math.random();
	//there might be some very small chance of r=1, which would cause a bug.
	return low+Math.floor(r*(high-low+1));
}
//***************************************//
 
//***********Class Definitions***********//

function _LinkedListElement(o){
	this.content = o;
	this.next = null;
}

function _LinkedList() {
	this.head = null;
	this.tail = null;
	this.current = null;
	this.last = null;
	this.length = 0;
}

/*
 * Add an element to the linked list.
 */
_LinkedList.prototype.add = function(o) {
	this.length++;
	if(this.head===null) {
		this.head = new _LinkedListElement(o);
		this.tail = this.head;
	}
	else {
		current = this.head;
		while(current.next !== null) current = current.next;
		current.next = new _LinkedListElement(o);
		this.tail = current.next;
	}
}

/*
 * For iterating through the linked list.  Returns true if there is a next element,
 * returns false otherwise.
 */
_LinkedList.prototype.next = function() {
	if (this.head===null) return false;
	if (this.current===null) {
		this.current=this.head;
		return true;
	}
	if (this.current.next === null) {
		this.last = this.current;
		this.current = null;
		return false;
	}
	this.last = this.current;
	this.current = this.current.next;
	return true;
}

/*
 * Resets the link iteration back to the head.
 */
_LinkedList.prototype.reset = function() {
	this.last = null;
	this.current = this.head;
}

_LinkedList.prototype.getCurrent = function() {
	if (this.current===null) return null;
	return this.current.content;
}

/*
 * Delete current element of the linked list and AUTOMATICALLY PROGRESS
 * to the next element of the list.  Returns true if deletion is successful, false
 * otherwise.
 */
_LinkedList.prototype.deleteCurrent = function() {
	if(this.current===null) return false;
	var next = this.current.next;
	if(next ===null) {
		if(this.last === null) { //if only one element in list
			this.head=null;
			this.tail=null
		}
		else { //otherwise, this is the last element in a list with >=2 elements
			this.last.next = null;
			this.tail = this.last;
		}
	}
	else {   //this is not the last element in the list
		if(this.last!==null) this.last.next = next;
		else this.head = null;
	}
	this.current = next;
	this.length--;
	return true;
}

/*
 * Returns a shallow copy of the linked list.
 */
 _LinkedList.prototype.copy = function() {
 	var l = new _LinkedList();
 	var current;
 	if(this.head===null) return l;
 	l.add(this.head.content);
 	current = this.head;
 	while(current.next !== null) {
 		current = current.next;
 		l.add(current.content);
 	}
 	return l;
 }
 
 /*
  * Move the head of the list to the tail of the list.
  */
_LinkedList.prototype.moveHeadToTail = function() {
	var temp;
	var newHead;
	if (this.length<2) return;
	if (this.length==2) {
		temp = this.head.content;
		this.head.content = this.tail.content;
		this.tail.content = temp;
		return;
	}
	newHead = this.head.next;
	this.tail.next = this.head;
	this.tail = this.head;
	this.tail.next = null;
	this.head = newHead;
}

 /*
  * Move the tail of the list to the head of the list.
  */
_LinkedList.prototype.moveTailToHead = function() {
	var temp;
	var newHead;
	var current;
	if (this.length<2) return;
	if (this.length==2) {
		temp = this.head.content;
		this.head.content = this.tail.content;
		this.tail.content = temp;
		return;
	}
	newHead = this.tail;
	newHead.next = this.head;
	this.head = newHead;
	//set new tail and remove link between new tail and new head
	current = this.head;
	while(current.next !== this.head) current = current.next;
	current.next = null;
	this.tail = current;
}

_LinkedList.prototype.toString = function() {	
	var objs = [];
	var current = this.head;
	if(this.length===0) return "";
	objs.push(this.head.content);
	while(current.next!==null) {
		current = current.next;
		objs.push(current.content);
	}
	return objs.join(", ");
}


function Card(val, suit) {
	this.val = val;  //0-12
	this.suit = suit;  //0,1,2,3
	this.randVal = null;
	this._cardValues = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
	this._suits = ["♠","♥","♦","♣"];
}

Card.prototype.toString =  function() {
	return this._cardValues[this.val]+this._suits[this.suit];
}

//value is random for use in shuffling
Card.prototype.valueOf = function() { return this.randVal; };

Card.prototype.setRandValue = function() { this.randVal = Math.random(); };

function CardContainer() {
	this.cards = [];
}

CardContainer.prototype.toString = function() { return this.cards.join(", "); }

CardContainer.prototype.setCards = function(arrayOfCards) {
	this.cards = arrayOfCards;
}

function Player(name, chips) {
	CardContainer.call(this);
	this.name = name;
	this.chips = chips || 0;
}

Player.prototype = new CardContainer();

function CommunityCards() {
	CardContainer.call(this);
}

CommunityCards.prototype = new CardContainer();

function Deck() {
	CardContainer.call(this);
	for(var i=0; i<52; i++) this.cards.push(new Card(i%13, Math.floor(i/13)));
}

Deck.prototype = new CardContainer();

Deck.prototype.shuffle = function() { 
	for (var i=0; i<52; i++) {
		this.cards[i].setRandValue();
	}
	this.cards.sort(function(a,b){return b.valueOf()-a.valueOf()});
}

function makeTableConstructorClosure() {
	var tableCount=1;
	var cnstr = function(seats) {
		this.name = "Table " + tableCount++;
		//list of players, infer position based on their position in the list
		this.playerTurnList = new _LinkedList();
		this.seats = seats || 6;
		this.deck = new Deck();
		this.community = new CommunityCards();
		this.pot = 0;
	}
	return cnstr;
}

var Table = makeTableConstructorClosure();

/*
 * Return true if able to seat player, false if table is full.
 */
Table.prototype.seatPlayer = function(player) {
	if(this.playerTurnList.length >= this.seats) return false;
	this.playerTurnList.add(player);
	return true;
}

Table.prototype.passTheButton = function() {
	this.playerTurnList.moveTailToHead();
}

/*
 * It's more trouble than its worth to do deal order "correctly" and
 * it makes no visible difference, so cards are dealt out of turn, two cards
 * at a time starting at the small blind.
 */
Table.prototype.dealPlayerCards = function() {
	var dealList = this.playerTurnList.copy();
	var player;
	if(this.playerTurnList.length<2) {
		throw new Error("Not enough players to deal cards");
	}
	while(dealList.next()) {
		player = dealList.getCurrent();
		player.cards.push(this.deck.cards.pop());
		player.cards.push(this.deck.cards.pop());
	}
}

Table.prototype.dealFlop = function() {
	for(var i=0; i<3; i++) this.community.cards.push(this.deck.cards.pop());
}

Table.prototype.dealTurn = function() {
	this.community.cards.push(this.deck.cards.pop());
}

Table.prototype.dealRiver = function() {
	this.community.cards.push(this.deck.cards.pop());
}

Table.prototype.returnCards = function() {
	var dealList = this.playerTurnList.copy();
	var player;
	while(dealList.next()) {
		player = dealList.getCurrent();
		this.deck.cards.unshift(player.cards.pop());
		this.deck.cards.unshift(player.cards.pop());
	}
	for(var i=0; i<5; i++) {
		this.deck.cards.unshift(this.community.cards.pop());
	}
}

function View() {};

View.prototype.starLine = function() {
	console.log("***************************************************************");
}

/* 
 * Convert a position index (positive or negative, relative to the small blind = 0)
 * to a description of the position ("Button", "UTG", etc.)
 */
View.prototype.getPositionName = function(index, seats) {
	var positions={};
	if(seats===1) positions = {"0":"Button"};
	else if(seats===2) positions = {"0":"Button", "1":"BB", "-1":"BB"};
	else {
		positions = {"0":"SB", "1":"BB", "-1":"Button"};
		if(seats===3) {
			positions[2]="Button";
			positions[-2]="BB";
		}
		if(seats===4) {
			positions[2]="CO";
			positions[3]="Button";
			positions[-2]="CO";
			positions[-3]="BB";
		}
		if(seats===5) {
			positions[2]="HJ";
			positions[3]="CO";
			positions[4]="Button";
			positions[-2]="CO";
			positions[-3]="HJ";
			positions[-4]="BB";
		}
		if(seats===6) {
			positions[2]="UTG";
			positions[3]="HJ";
			positions[4]="CO";
			positions[5]="Button";
			positions[-2]="CO";
			positions[-3]="HJ";
			positions[-4]="UTG";
			positions[-5]="BB";
		}
	}
	return positions[index];
}

/*
 *Show players, their position, and their hole cards.
 */
View.prototype.showPlayers = function(table) {
	var showPlayerList = table.playerTurnList.copy();
	var player;
	var index=0;
	var playerPosition;
	var playerName;
	var playerCards;
	while(showPlayerList.next()) {
		player = showPlayerList.getCurrent();
		playerPosition = this.getPositionName(index, showPlayerList.length);
		playerName = player.name;
		playerCards = player+"";
		console.log(playerName + "(" + playerPosition + "): " + playerCards);
		index++;
	}
}

View.prototype.showFlop = function(table) {
	var flopCards = new CardContainer();
	flopCards.setCards(table.community.cards.slice(0,3));
	console.log("Flop: "+flopCards);
}

View.prototype.showTurn = function(table) {
	var turnCard = new CardContainer();
	turnCard.setCards([table.community.cards[3]]);
	console.log("Turn: "+turnCard);
}

View.prototype.showRiver = function(table) {
	var riverCard = new CardContainer();
	riverCard.setCards([table.community.cards[4]]);
	console.log("River: "+riverCard);
}

View.prototype.showTable = function (table) {
	console.log(table.name);
	this.showPlayers(table);
	this.showFlop(table);
	this.showTurn(table);
	this.showRiver(table);
	console.log("\n");
}

function Demo() {
	this.view = new View();
	
};

Demo.prototype.dealEntireHand = function(table) {
	table.dealPlayerCards();
	table.dealFlop();
	table.dealTurn();
	table.dealRiver();
}

Demo.prototype.randomName = function() {
	//randomly generated names.  I'll admit these are pretty bad for a poker table.
	var names = ["Thanh","Martin","Alexander",  "Collin",  "Patrick",  "Milan",  
	"Rocky",  "Stuart",  "Britt",  "Ian",  "Cedrick",  "Abram",  "Emmanuel",  "Sonny",  
	"Percy",  "Antone",  "Tommy",  "Hollis",  "Ricky",  "Tod",  "Cory",  "Benjamin",  
	"Florentino",  "Mathew",  "Jimmie",  "Andrea",  "Kirby",  "Neil",  "Truman",  
	"Julius",  "Dustin",  "Clyde",  "Esteban",  "Otto",  "Ron",  "Oliver",  "Timmy",  
	"Robin",  "Tanner",  "Bryan",  "Ezequiel",  "Moshe",  "Casey",  "Emile",  
	"Rayford",  "Alfredo",  "Jewel",  "Wilbur", "Leslie", "Newton"]; 
	return names[_randInt(0,49)];
}

Demo.prototype.nextHand = function(table) {
	table.deck.shuffle();
	table.passTheButton();
	this.dealEntireHand(table);
	this.view.showTable(table);
	table.returnCards();
}

Demo.prototype.run = function() {
	this.view.starLine();
	console.log("Create first table, with 6 random players.  Deal 7 hands.");
	this.view.starLine();
	t1 = new Table();
	t1.seatPlayer(new Player("Tom Conrad"));
	t1.seatPlayer(new Player(this.randomName()));
	t1.seatPlayer(new Player(this.randomName()));
	t1.seatPlayer(new Player(this.randomName()));
	t1.seatPlayer(new Player(this.randomName()));
	t1.seatPlayer(new Player(this.randomName()));
	this.nextHand(t1);
	this.nextHand(t1);
	this.nextHand(t1);
	this.nextHand(t1);
	this.nextHand(t1);
	this.nextHand(t1);
	this.nextHand(t1);
	this.nextHand(t1);
	this.view.starLine();
	console.log("Create second table, with 3 random players.  Deal 3 hands.");
	this.view.starLine();
	t2 = new Table();
	t2.seatPlayer(new Player(this.randomName()));
	t2.seatPlayer(new Player(this.randomName()));
	t2.seatPlayer(new Player(this.randomName()));
	this.nextHand(t2);
	this.nextHand(t2);
	this.nextHand(t2);
	this.view.starLine();
	console.log("Tom Dwan sits down at the second table.  Deal 3 more hands.");
	t2.seatPlayer(new Player("Tom Dwan"));
	this.view.starLine();
	this.nextHand(t2);
	this.nextHand(t2);
	this.nextHand(t2);
	this.view.starLine();
	console.log("Deal 1 more hand at the first table");
	this.view.starLine();
	this.nextHand(t1);
	this.view.starLine();
	console.log("Table 3: heads up match.  Deal 5 more hands.");
	t3 = new Table();
	t3.seatPlayer(new Player("isildur1"));
	t3.seatPlayer(new Player("jungleman12"));
	this.view.starLine();
	this.nextHand(t3);
	this.nextHand(t3);
	this.nextHand(t3);
	this.nextHand(t3);
	this.nextHand(t3);
}
//***************************************//

var demo = new Demo();
demo.run();