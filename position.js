// useful aliases
var PI = Math.PI;
var cos = Math.cos;
var sin = Math.sin;

// basic directions within a slot
var shiftTheta = PI / 20,
	baseTheta = PI / 3,
	directions = [];
for ( var i=0; i<6; i++ ) {
	directions.push( [ cos( shiftTheta+i*baseTheta ), sin( shiftTheta+i*baseTheta ) ] );
}

// templates
var slotTemplates = [ 
		{ src: 'hexagon-bg-1.png', r: 160, h: 160*cos(PI/3)},
		{ src: 'hexagon-bg-2.png', r: 320, h: 320*cos(PI/3)},
		{ src: 'hexagon-bg-3.png', r: 480, h: 480*cos(PI/3)} ] ,
	templateID = 0;

// slots
function Slot(x, y) {
	var self = this;
	// basic parameters: center position and height
	this.x = x;
	this.y = y;
	this.h = slotTemplates[templateID].h;

	// attach image
	this.img = new Image();
	this.img.src = slotTemplates[templateID].src;
	this.img.onload = function() { self.updatePosition(); };

	// load into the document
	document.body.appendChild(this.img);

	this.updatePosition = function(x, y) {
		console.log("updatePosition: "+x+" - "+y+" / "+this);
		if ( x && y ) {
			this.x = x;
			this.y = y;
		}
		this.img.style.top = ( this.y - this.img.height/2 ) + "px";
		this.img.style.left = ( this.x - this.img.width/2 ) + "px";
	}

	this.setOpacity = function(opacity) {
		this.img.style.opacity = opacity;
	}

	this.updateTemplate = function() {
		this.h = slotTemplates[templateID].h;
		this.img.src = slotTemplates[templateID].src;
		this.updatePosition();
	}
}

var slots = [],
	cursorShadow = new Slot();

// setup cursorShadow
cursorShadow.setOpacity( 0.4 );




function addSlot(evt) {
	//if(!slots.length) {
		var slot = new Slot(evt.clientX, evt.clientY);
		slots.push(slot);
		document.body.appendChild(slot.img);
	//}
}

function changeTemplate(evt) {
	if ( evt.charCode == 49 ) { 
		templateID = 0;
	} else if ( evt.charCode == 50 ) {
		templateID = 1;
	} else if ( evt.charCode == 51 ) { 
		templateID = 2;
	}
	cursorShadow.updateTemplate();
}

function dropCursorShadow(evt) {
	cursorShadow.updatePosition( evt.clientX, evt.clientY );
}

document.onmousemove = dropCursorShadow;
document.onclick = addSlot;
document.onkeypress = changeTemplate;