/**
 * Select a random slot (not currently animated) and animate it once.
 * The slot gets the .random class to mark the fact that we need to 
 * animate another random slot at the end of the animation.
 */
function animateRandomSlot() {
    
    var slots,
        id,
        slot;

    // Select all slots not currently animated
    slots = document.querySelectorAll('[data-frames]:not(.flipping)');

    // Pick a slot at random amongst them
    id = Math.floor( Math.random() * slots.length );
    slot = slots[id];

    // Add the .random class to mark the context
    slot.classList.add( 'random' );

    // Setup animation
    startAnimation(slot);
    stopAnimationAfterIteration(slot);
}

/**
 * Start the animation on each frame of the selected slot
 * Add .flipping class to the the slot to mark its status
 */
function startAnimation( slot ) {
    // add .flipping class
    slot.classList.add( 'flipping' );

    // drill down to frames
    var frames = slot.children;
    for ( var i = 0; i < frames.length; i++ ) {
        if ( !( frames[i].classList.contains('frame-1') ||
                frames[i].classList.contains('frame-2') ||
                frames[i].classList.contains('frame-3') ||
                frames[i].classList.contains('frame-4') ) ) {
            continue;
        }
        /*  this makes sure the animation will run multiple time
            http://css-tricks.com/restart-css-animation/    */
        frames[i].classList.remove('flip');
        frames[i].offsetWidth = frames[i].offsetWidth;
        frames[i].classList.add('flip');
    }
}

function startAnimationFromMask() {
    var slot = this.parentNode.parentNode;
    startAnimation( slot );
}

/**
 * Add event listener that will stop the animation at the 
 * end of the current iteration.
 */
function stopAnimationAfterIteration( slot ) {

    var frames = slot.children;
    
    for ( var i = 0; i < frames.length; i++ ) {
        if ( !( frames[i].classList.contains('frame-1') ||
                frames[i].classList.contains('frame-2') ||
                frames[i].classList.contains('frame-3') ||
                frames[i].classList.contains('frame-4') ) ) {
            continue;
        }

        // stop animation after the end of the iteration
        frames[i].addEventListener('webkitAnimationIteration', stopFlipping);
        frames[i].addEventListener('oanimationiteration', stopFlipping);
        frames[i].addEventListener('MSAnimationIteration', stopFlipping);
        frames[i].addEventListener('animationiteration', stopFlipping);
    }
}

function stopAnimationAfterIterationFromMask() {

    var slot = this.parentNode.parentNode;
    stopAnimationAfterIteration( slot );

}

/**
 * Stop the animation for the selected frame.
 * Remove .flipping class to the the parent slot to mark its status
 */
function stopFlipping( evt ) {

    var frame = evt.target,
        slot = frame.parentNode;

    // Remove .flipping class on parent slot
    slot.classList.remove( 'flipping' );

    // Stop animation
    frame.classList.remove('flip');

    // Allow animation to be ran for mor than one iteration in the future
    frame.removeEventListener('webkitAnimationIteration', stopFlipping);
    frame.removeEventListener('oanimationiteration', stopFlipping);
    frame.removeEventListener('MSAnimationIteration', stopFlipping);
    frame.removeEventListener('animationiteration', stopFlipping);

    // Launch animation on another slot if this one was launched at random
    if ( slot.classList.contains( 'random' ) ) {
        slot.classList.remove( 'random' );
        animateRandomSlot();
    }
}


/** 
 * Setup event listeners so that animation launches when the mouse hovers 
 * the slot's mask and that it will stop at the natural end of the iteration
 * when the mouse leaves the mask.
 */
function setupAnimationOnHover() {

    // Select slots that can be animated
    var slots = document.querySelectorAll('[data-frames]');

    // Launch animation upon hover
    for ( var i = 0; i < slots.length; i++ ) {
        var mask = slots[i].querySelector('.hexagon-mask');
        mask.onmouseover = startAnimationFromMask;
        mask.onmouseout = stopAnimationAfterIterationFromMask;
    }
}

/** 
 * BEGIN
 */

setupAnimationOnHover();

// The number of animateRandomSlot() calls is the number of 
// concurrently animated slots
animateRandomSlot();
animateRandomSlot();
