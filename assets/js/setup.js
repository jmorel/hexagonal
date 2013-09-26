// useful aliases
var PI = Math.PI;
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var abs = Math.abs;


// PArameters
var MARGIN = 5; //px


// basic directions within a slot
var shiftTheta = PI / 20 + PI / 6,
	baseTheta = PI / 3,
	directions = [];
for ( var i=0; i<6; i++ ) {
	directions.push( { theta: shiftTheta+i*baseTheta, x: cos( shiftTheta+i*baseTheta ), y: sin( shiftTheta+i*baseTheta ) } );
}

// templates
smallNode = document.createElement('div');
smallNode.className = 'slot-small';
smallNode.innerHTML = '<div class="text-content"><div class="vertically-centered"></div></div>';

mediumNode = document.createElement('div');
mediumNode.className = 'slot-medium';
mediumNode.innerHTML = '<div class="text-content"><div class="vertically-centered"></div></div>';

largeNode = document.createElement('div');
largeNode.className = 'slot-large';
largeNode.innerHTML = '<div class="text-content"><div class="vertically-centered"></div></div>';

var slotSizes = {
		small: 	{ node: smallNode, r: 80, h: 80*cos(PI/6)},
		medium:	{ node: mediumNode, r: 160, h: 160*cos(PI/6)},
		large: 	{ node: largeNode, r: 240, h: 240*cos(PI/6)} } ,
	sizeID = 'small';

// slots
function Slot() {

	var self = this;
	
	// basic parameters: center position and height
	self.x = 0;
	self.y = 0;
	self.height = 0;
	self.width = 0;
	self.h = 0;
	self.node = undefined;
	self.isSelected = false;
	self.id = 0;

	self.toggleSelectedStatus = function() {
		if ( self.isSelected ) {
			self.isSelected = false;
			self.node.style.opacity = 1;
			selectedSlot = undefined;
			if ( !self.id ) {
				// The element did not exist yet
				// we insert it in the page
				slots.push( self );
				self.id = slots.length;
				self.node.dataset.slotid = slots.length;
			}
		} else { 
			self.isSelected = true;
			self.node.style.opacity = 0.4;
			selectedSlot = self;
		}
		
	}

	self.setAll = function(node, x, y, h) {
		self.setNode( node );
		self.setPosition( x, y );
		self.setSize( h );
	}

	self.setID = function( id ) {
		self.id = id;
	}

	self.setNode = function(node) {
		self.node = node;
		self.width = parseFloat( node.clientWidth );
		self.height = parseFloat( node.clientHeight );
		self.node.onclick = self.toggleSelectedStatus;
	}

	self.setPosition = function(x, y) {
		if ( x && y ) {
			self.x = x;
			self.y = y;
		}
		// revert y axis
		self.node.style.top = ( -( self.y + self.height/2 ) ) + "px";
		self.node.style.left = ( self.x - self.width/2 ) + "px";
	}

	self.setSize = function(h) {
		self.h = h;
	}
}

var slots = [],
	selectedSlot = undefined;


function changeMode( evt ) {
	console.log(evt.charCode);
	if ( evt.charCode == 49 ) { 
		// key = 1, small slot
		//sizeID = 'small';
		var s = new Slot();
		s.setSize( slotSizes['small'].h  );
		s.setNode( slotSizes['small'].node );
		document.body.appendChild( s.node );
		s.toggleSelectedStatus();

	} else if ( evt.charCode == 50 ) {
		// key = 2, medium slot
		var s = new Slot();
		s.setSize( slotSizes['medium'].h  );
		s.setNode( slotSizes['medium'].node );
		document.body.appendChild( s.node );
		s.toggleSelectedStatus();
	} else if ( evt.charCode == 51 ) { 
		// key = 3, large slot
		var s = new Slot();
		s.setSize( slotSizes['large'].h  );
		s.setNode( slotSizes['large'].node );
		document.body.appendChild( s.node );
		s.toggleSelectedStatus();
	} else if ( evt.charCode == 122 ) {
		// key = z, undo
		//slot = slots.pop();
		//document.body.removeChild(slot.img);
	} else if ( evt.charCode == 100 ) {
		// key = d, delete
	} else if ( evt.charCode == 48 ) {
		// key = 0, unselect all
	}
}

/*function dropCursorShadow(evt) {
	//cursorShadow.updatePosition(evt.pageX, - evt.pageY );
}*/

/*function addSlot(evt) {
	// create and display said slot
	var slot = new Slot(evt.pageX, -evt.pageY);
	slots.push(slot);
	document.body.appendChild(slot.img);

	// we need to adjust the position with the other slots already created
	// find the closest slot
	if(slots.length <= 1) { return; }
	var dMin = distance(slot, slots[0]);
	var closestSlot = slots[0];
	// go to length-2 to avoid the slot we just added
	var i = 1;
	for ( i; i < slots.length-1; i++ ) {
		var d = distance(slot, slots[i]);
		if(dMin > d) {
			closestSlot = slots[i];
			dMin = d;
		}
	}
	// bring the new slot closer to the closest one
	var dir = direction(slot, closestSlot);
	var d = distance(slot, closestSlot) - MARGIN;
	slot.updatePosition(slot.x+d*dir.x, slot.y+d*dir.y);

	
	var slidingDir = { theta: dir.theta+PI/2, x: cos( dir.theta+PI/2 ), y: sin( dir.theta+PI/2 ) };
	var secondClosestSlot;
	// now find the second closest in an adjacent direction
	for ( var j=0; j < slots.length-1; j++ ) {
		// do not compare to closest slot 
		if ( slots[j] == closestSlot ) continue;
		// only consider adjacent directions
		var tempDir = direction(slot, slots[j]);
		var deltaTheta = abs(tempDir.theta - dir.theta);
		if ( deltaTheta > ( PI + 0.5 ) ) {
			deltaTheta = 2*PI - deltaTheta;
		}
		if ( deltaTheta > (PI/3 + 0.5) ) continue;
		var d = distance(slot, slots[j]);
		if ( !secondClosestSlot ) {
			secondClosestSlot = slots[j];
			dMin = d;
		} else if ( dMin > d ) {
			secondClosestSlot = slots[j];
			dMin = d;
		}
	}
	if ( secondClosestSlot ) {
		dir = direction(slot, secondClosestSlot);
		d = distance(slot, secondClosestSlot) - MARGIN;
		cosAlpha = slidingDir.x*dir.x + slidingDir.y*dir.y; // both slidingDir and dir have a length of 1
		length = d / cosAlpha;
		slot.updatePosition(
			slot.x+length*slidingDir.x, slot.y+length*slidingDir.y);
	}
	
}*/

/*function distance(slotA, slotB) {
	var vector = { x: slotB.x-slotA.x, y: slotB.y-slotA.y },
		dir = direction(slotA, slotB);
	var dotProduct = vector.x*dir.x + vector.y*dir.y;
	var distance = dotProduct - slotA.h - slotB.h;
	return distance;
}
function direction(slotA, slotB) {
	var vector = { x: slotB.x-slotA.x, y: slotB.y-slotA.y },
		dir = directions[0],
		max = 0;
	for (var i = 0; i < directions.length; i++) {
		var dotProduct = vector.x*directions[i].x + vector.y*directions[i].y;
		if ( dotProduct > max ) {
			dir = directions[i];
			max = dotProduct;
		}
	};
	return dir;
}*/

/*function click( evt ) {
	//addSlot( evt );
	console.log('click');
}*/

function loadExistingSlots() {
	// Load already existing slots
	var divs = document.querySelectorAll('body > div');
	for ( var i = 0; i < divs.length; i++ ) {
		var div = divs[i];
		
		var s = new Slot();
		// set up size
		if (	div.classList.contains('slot-small') ||
				div.classList.contains('arrow-left') ||
				div.classList.contains('arrow-right') ||
				div.classList.contains('arrow-up') ||
				div.classList.contains('arrow-down') ) {
			s.setSize( slotSizes['small'] );
		} else if ( div.classList.contains('slot-medium') ) {
			s.setSize( slotSizes['medium'] );
		} else if ( div.classList.contains('slot-large') ) {
			s.setSize( slotSizes['large']  );
		} else {
			continue;
		}
		
		// set up node
		s.setNode( div );

		// set up position
		s.setPosition( parseFloat( div.style.left ), -parseFloat( div.style.top ) );

		// append slot
		slots.push( s );

		// set slot id into html doc
		div.dataset.slotid = slots.length;
		s.setID( slots.length );
	}
}

function disableExistingLinks() {
	var links = document.querySelectorAll('a');
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		link.onclick = function() { return false; }
	};
}

// BEGIN !
loadExistingSlots();
disableExistingLinks();

function move( evt ) {
	if ( selectedSlot ) {
		selectedSlot.setPosition( evt.pageX, -evt.pageY);
	}
}

document.onmousemove = move;
/*document.onclick = click;*/
document.onkeypress = changeMode;  