// PARAMETERS

/*var THETA = Math.PI / 20;
var COS = Math.cos(THETA);
var SIN = Math.sin(THETA);
var UNIT = 160;
var GRID_UNIT = 160;

var elts = document.querySelectorAll('.positioned');
for(var i=0; i<elts.length; i++) {
	var e = elts[i];
	var row = parseInt(e.getAttribute('data-row'));
	var col = parseInt(e.getAttribute('data-col'));
	var shiftLeft = GRID_UNIT * (col * COS + row * SIN);
	var shiftTop = GRID_UNIT * (row * COS - col * SIN);
	e.style.left = parseInt(shiftLeft).toString() + 'px';
	e.style.top = parseInt(shiftTop).toString() + 'px';
	console.log("TOP: "+shiftTop+" / LEFT: "+shiftLeft);
}*/

/*var THETA = Math.PI / 20;
var COS = Math.cos(THETA);
var SIN = Math.sin(THETA);
var RADIUS = 80;

var elts = document.querySelectorAll('.positioned');
for(var i=0; i<elts.length; i++) {
	var e = elts[i];
	var row = parseInt(e.getAttribute('data-row'));
	var col = parseInt(e.getAttribute('data-col'));
	
	var centerLeft = RADIUS * (col - row / 2);
	var centerTop = RADIUS * row;

	//var shiftLeft = centerLeft - RADIUS;
	//var shiftTop = centerTop - RADIUS*Math.sqrt(3)/2;

	var shiftLeft = centerLeft;
	var shiftTop = centerTop;
	

	e.style.left = parseInt(shiftLeft).toString() + 'px';
	e.style.top = parseInt(shiftTop).toString() + 'px';
	
	console.log("TOP: "+shiftTop+" / LEFT: "+shiftLeft);
}*/

var size = 'hexagon-bg-1.png',
	slots = [],
	slotShadow = new Image();

slotShadow.className = "positioned";
slotShadow.style.opacity = 0.4;
slotShadow.src = 'hexagon-bg-1.png';
document.body.appendChild(slotShadow);

function Slot(x, y) {
	var slot = new Image();
	slot.src = size;
	slot.className = "positioned";
	slot.onload = function() {
		console.log(x+" - "+y);
		x -= this.width/2;
		y -= this.height/2;
		this.style.top = y+"px";
		this.style.left = x+"px";
		console.log(x+" - "+y);
	}
	return slot;
}

function newSlot(evt) {
	//if(!slots.length) {
		var slot = new Slot(evt.clientX, evt.clientY);
		slots.push(slot);
		document.body.appendChild(slot);
	//}
}

function changeSize(evt) {
	if ( evt.charCode == 49 ) { 
		size = 'hexagon-bg-1.png';
		slotShadow.src = 'hexagon-bg-1.png';
	} else if ( evt.charCode == 50 ) {
		size = 'hexagon-bg-2.png';
		slotShadow.src = 'hexagon-bg-2.png';
	} else if ( evt.charCode == 51 ) { 
		size = 'hexagon-bg-3.png'; 
		slotShadow.src = 'hexagon-bg-3.png';
	}
}

function dropSlotShadow(evt) {
	slotShadow.style.left = ( evt.clientX - slotShadow.width/2 ) + "px";
	slotShadow.style.top = ( evt.clientY - slotShadow.height/2 ) + "px";
}

document.onmousemove = dropSlotShadow;
document.onclick = newSlot;
document.onkeypress = changeSize;