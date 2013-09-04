var flippingSlots = document.querySelectorAll('[data-frames] .hexagon-mask');
for ( var i = 0; i < flippingSlots.length; i++ ) {
    flippingSlots[i].onmouseover = startAnimation;
    flippingSlots[i].onmouseout = stopAnimationAfterIteration;
}

function startAnimation() {
    console.log('start animation');
    // back to the slot element
    var slot = this.parentNode.parentNode;
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

function stopAnimationAfterIteration() {
    console.log('out');
    // back to the slot element
    var slot = this.parentNode.parentNode;
    // drill down to frames
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

function stopFlipping(evt) {
    console.log(evt);
    var frame = evt.target;
    frame.classList.remove('flip');
    frame.removeEventListener('webkitAnimationIteration', stopFlipping);
    frame.removeEventListener('oanimationiteration', stopFlipping);
    frame.removeEventListener('MSAnimationIteration', stopFlipping);
    frame.removeEventListener('animationiteration', stopFlipping);
}
