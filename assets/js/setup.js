(function() {
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
			small: 	{ node: smallNode, r: 80, h: 80*cos(PI/6), width: 159, height: 150},
			medium:	{ node: mediumNode, r: 160, h: 160*cos(PI/6), width: 317, height: 299},
			large: 	{ node: largeNode, r: 240, h: 240*cos(PI/6), width: 475, height: 448} } ,
		sizeID = 'small';

	var smallSlot = new Slot();
	smallSlot.setNode( slotSizes['small'].node );
	smallSlot.setSize( slotSizes['small'].h, slotSizes['small'].width, slotSizes['small'].height );

	var mediumSlot = new Slot();
	mediumSlot.setNode( slotSizes['medium'].node );
	mediumSlot.setSize( slotSizes['medium'].h, slotSizes['medium'].width, slotSizes['medium'].height );

	var largeSlot = new Slot();
	largeSlot.setNode( slotSizes['large'].node );
	largeSlot.setSize( slotSizes['large'].h, slotSizes['large'].width, slotSizes['large'].height );

	// slots
	function Slot() {

		var self = this;
		
		// Attributes

		// Coordinates of the slot's center in a graph 
		// where x is positive towards the right and y 
		// positive upwards (all in px)
		self.x = 0;
		self.y = 0;

		// Dimension of the slot's div in px
		self.height = 0;
		self.width = 0;

		// Length of the height of the hexagon
		self.h = 0;

		// Associated div
		self.node = undefined;

		// Selection status
		self.isSelected = false;

		// ID
		self.id = 0;

		// Fit status
		self.fitted = false;

		// Methods

		/**
		 * Upon click, 3 actions:
		 * * The slot wasn't properly instanciated (ie it was 
		 *   only a hover shadow) -> instanciate it
		 * * The slot is selected (and therefore being dragged)
		 *   -> reposition it
		 * * The slot is not selected -> select it and start dragging
		 */
		self.onClick = function() {
			if ( !self.id ) {
				// The element did not exist yet
				// we insert it in the page
				self.instanciate();
				return;
			}

			// normal procedure afterwards
			if ( self.fitted ) {
				self.cancelFit();
			}

			if ( self.isSelected ) {
				// Unselect
				self.isSelected = false;
				selectedSlot = undefined;
			} else { 
				// Select
				self.isSelected = true;
				selectedSlot = self;
			}
		}

		self.toggleCursorStatus = function() {
			if ( self.isSelected ) {
				// hide element
				self.isSelected = false;
				selectedSlot = undefined;
				document.body.removeChild( self.node );
			} else {
				// show element
				self.isSelected = true;
				selectedSlot = self;
				document.body.appendChild( self.node );
			}
		}

		/**
		 * Create a new slot, duplicate of this one, and 
		 * insert it in the slots array.
		 */
		self.instanciate = function() {
			var s = new Slot();
			// set up node
			s.setNode( self.node.cloneNode(true) );
			// this is necessary, height and width cannot be obtained with clientWidth/Height yet
			s.setSize( self.h, self.width, self.height );
			// display element. clientWidth and clientHeight are now available
			document.body.appendChild( s.node );
			// set up position
			s.setPosition( self.x, self.y );
			// append slot to slots array
			slots.push( s );
			// set slot id into html doc
			s.node.dataset.slotid = slots.length;
			s.setID( slots.length );

			return s;
		}

		self.setID = function( id ) {
			self.id = id;
		}

		self.setNode = function(node) {
			self.node = node;
			self.width = parseFloat( node.clientWidth );
			self.height = parseFloat( node.clientHeight );
			self.node.onclick = self.onClick;
		}

		/**
		 * Save slot central position and update display at ( x - width/2, y - height/2)
		 */
		self.setPosition = function(x, y) {
			if ( x && y ) {
				self.x = x;
				self.y = y;
			}
			// revert y axis
			self.node.style.top = ( -( self.y + self.height/2 ) ) + "px";
			self.node.style.left = ( self.x - self.width/2 ) + "px";
		}

		self.setSize = function(h, width, height) {
			self.h = h;
			self.width = width;
			self.height = height;
		}

		self.registerFit = function() {
			self.fitted = true;
			self.isSelected = false;
			self.node.classList.add( 'fitted' );
			selectedSlot = undefined;
		}

		self.cancelFit = function() {
			self.fitted = false;
			self.node.classList.remove( 'fitted' );
		}

		self.fitPosition = function() {

			self.cancelFit();

			var fittedSlots = [];
			for (var i = 0; i < slots.length; i++) {
				if ( slots[i].fitted ) {
					fittedSlots.push( slots[i] );
				}
			};

			if ( fittedSlots.length == 0 ) {
				self.registerFit();
				return;
			}

			// we need to adjust the position with the other slots already created
			// find the closest slot
			var dMin = distance(self, fittedSlots[0]);
			var closestSlot = fittedSlots[0];
			for ( var i = 1; i < fittedSlots.length; i++ ) {
				var d = distance(self, fittedSlots[i]);
				if( dMin > d ) {
					closestSlot = fittedSlots[i];
					dMin = d;
				}
			}

			// bring the new slot closer to the closest one
			var dir = direction(self, closestSlot);
			var d = distance(self, closestSlot) - MARGIN;
			self.setPosition(self.x+d*dir.x, self.y+d*dir.y);

			if ( fittedSlots.length == 1 ) {
				self.registerFit();
				return;
			}

			var slidingDir = { theta: dir.theta+PI/2, x: cos( dir.theta+PI/2 ), y: sin( dir.theta+PI/2 ) };
			var secondClosestSlot = undefined;
			// now find the second closest in an adjacent direction
			for ( var i = 0; i < fittedSlots.length; i++ ) {
				// do not compare to closest slot 
				if ( fittedSlots[i] == closestSlot ) continue;
				// only consider adjacent directions
				var tempDir = direction(self, fittedSlots[i]);
				var deltaTheta = abs(tempDir.theta - dir.theta);
				// bring deltaTheta between the [0 ; PI] range
	/*			if ( deltaTheta > ( PI + 0.5 ) ) { 
					deltaTheta = 2*PI - deltaTheta;
				}*/
				// adjacent direction <=> deltaTheta ~= PI/3 or deltaTheta ~= 5*PI/3
				if ( !(	deltaTheta > (PI/3 - 0.5) &&
						deltaTheta < (PI/3 + 0.5) ) &&
					 !(	deltaTheta > (5*PI/3 - 0.5) &&
					 	deltaTheta < (5*PI/3 + 0.5) ) ) {
					continue;
				}

				var d = distance(self, fittedSlots[i]);
				if ( !secondClosestSlot ) {
					secondClosestSlot = fittedSlots[i];
					dMin = d;
				} else if ( dMin > d ) {
					secondClosestSlot = fittedSlots[i];
					dMin = d;
				}
			}
			if ( secondClosestSlot ) {
				dir = direction(self, secondClosestSlot);
				d = distance(self, secondClosestSlot) - MARGIN;
				cosAlpha = slidingDir.x*dir.x + slidingDir.y*dir.y; // both slidingDir and dir have a length of 1
				length = d / cosAlpha;
				self.setPosition(
					self.x+length*slidingDir.x, self.y+length*slidingDir.y);
			}

			// register position
			self.registerFit();
			
		}
	}

	var slots = [],
		selectedSlot = undefined;


	function changeMode( evt ) {
		console.log(evt.charCode);
		if ( evt.charCode == 49 ) { 
			divMode.innerHTML = 'New small slot';
			// key = 1, small slot
			//sizeID = 'small';
			if ( selectedSlot != smallSlot ) {
				if ( selectedSlot == mediumSlot || selectedSlot == largeSlot ) {
					selectedSlot.toggleCursorStatus();
				}
				smallSlot.toggleCursorStatus();
			}

		} else if ( evt.charCode == 50 ) {
			divMode.innerHTML = 'New medium slot';
			// key = 2, medium slot
			if ( selectedSlot != mediumSlot ) {
				if ( selectedSlot == smallSlot || selectedSlot == largeSlot ) {
					selectedSlot.toggleCursorStatus();
				}
				mediumSlot.toggleCursorStatus();
			}
		} else if ( evt.charCode == 51 ) { 
			divMode.innerHTML = 'New large slot';
			// key = 3, large slot
			if ( selectedSlot != largeSlot ) {
				if ( selectedSlot == mediumSlot || selectedSlot == smallSlot ) {
					selectedSlot.toggleCursorStatus();
				}
				largeSlot.toggleCursorStatus();
			}
		} else if ( evt.charCode == 122 ) {
			divMode.innerHTML = 'undo';
			// key = z, undo
			//slot = slots.pop();
			//document.body.removeChild(slot.img);
		} else if ( evt.charCode == 100 ) {
			// key = d, delete
		} else if ( evt.charCode == 48 ) {
			divMode.innerHTML = 'unselect';
			// key = 0, unselect all
			if ( 	selectedSlot == mediumSlot || 
					selectedSlot == largeSlot ||
					selectedSlot == smallSlot) {
					selectedSlot.toggleCursorStatus();
				}
		} else if ( evt.charCode == 102 ) {
			divMode.innerHTML = 'fit';
			// key = f, fit selected item
			if ( !( selectedSlot == mediumSlot || 
					selectedSlot == largeSlot ||
					selectedSlot == smallSlot )) {
					selectedSlot.fitPosition();
			} else {
				var newSlot = selectedSlot.instanciate();
				newSlot.fitPosition();
			}
		} else if ( evt.charCode == 112 ) {
			// key = p, fit whole page dimension
			fitPageDimension();
		}
	}



	function distance(slotA, slotB) {
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
	}

	function fitPageDimension() {

		console.log( slots );

		var width = { start: document.width, end: 0 },
			height = { start: -document.height, end: 0 },
			translate = { x: 0, y: 0 };

		// Find out what the page's utile size is
		for (var i = 0; i < slots.length; i++) {
			var slot = slots[i];
			width.start = Math.min( width.start, slot.x - slot.width/2 );
			width.end = Math.max( width.end, slot.x + slot.width/2 );
			// the y axis is reverted here
			height.end = Math.min( height.end, slot.y - slot.height/2 );
			height.start = Math.max( height.start, slot.y + slot.height/2 );
		}

		// Add margins
		width.start = width.start - smallSlot.width;
		width.end = width.end + smallSlot.width;
		height.start = height.start + smallSlot.height;
		height.end = height.end - smallSlot.height;

		// Define relative translation
		translate.x = width.start;
		translate.y = height.start;
		
		// Translate all elements
		for (var i = 0; i < slots.length; i++) {
			var slot = slots[i];
			slot.setPosition( slot.x - translate.x, slot.y - translate.y );
		}

		// Reduce page size
		document.body.style.width = (width.end - width.start).toString() + "px";
		document.body.style.height = (height.start - height.end).toString() + "px";
	}


	function loadExistingSlots() {
		// Load already existing slots
		var divs = document.querySelectorAll('body > div');
		for ( var i = 0; i < divs.length; i++ ) {
			var div = divs[i];
			
			var s = new Slot();

			// set up size
			var size;
			if (	div.classList.contains('slot-small') ||
					div.classList.contains('arrow-left') ||
					div.classList.contains('arrow-right') ||
					div.classList.contains('arrow-up') ||
					div.classList.contains('arrow-down') ) {
				size = slotSizes['small'];
			} else if ( div.classList.contains('slot-medium') ) {
				size = slotSizes['medium'];
			} else if ( div.classList.contains('slot-large') ) {
				size = slotSizes['large'];
			} else {
				continue;
			}
			s.setSize( size.h, size.width, size.height );
			
			// set up node
			s.setNode( div );

			// set up position
			s.setPosition( 
				parseFloat( div.style.left ) + parseFloat( div.clientWidth )/2, 
				-parseFloat( div.style.top ) - parseFloat( div.clientHeight)/2 );

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
	var divMode = document.querySelector('.setup-mode');
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

})();