var oldMouseX, oldMouseY;

function scrollX() {
    var x = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    return x;
}

function scrollY () {
    var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return y;
}
window.onmousedown = function(evt) {
    // change cursor & disable text selection, img dragging etc
    document.body.classList.add('dragging');
    // save current mouse position
    oldMouseX = evt.clientX;
    oldMouseY = evt.clientY;
    window.onmousemove = dragAround;
}

window.onmouseup = function(evt) {
    document.body.classList.remove('dragging');
    window.onmousemove = function() {}
}

function dragAround(e) {
    var mouseX = e.clientX,
        mouseY = e.clientY,
        dx = mouseX - oldMouseX,
        dy = mouseY - oldMouseY;
    // update position
    window.scroll( scrollX() - dx, scrollY() - dy );
    // update old mouse position
    oldMouseX = mouseX;
    oldMouseY = mouseY;
}