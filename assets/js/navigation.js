(function() {

    var oldMouseX, 
        oldMouseY,
        isDragging = false,
        presentation;

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
        // reset isDragging
        isDragging = false;
        // Return false prevents the window to be dragged when 
        // the cursor isn't over the body anymore (e.g. over 
        // scrollbars)
        return false;
    }

    window.onmouseup = function(evt) {
        // stop isDragging
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
        // update isDragging status
        isDragging = true;
    }

    /**
     * Disable links during drag
     * isDragging contains the dragging status
     */

    function doNotFollowIfDrag() {
        if ( isDragging ) { return false; }
    }

    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = doNotFollowIfDrag;
    };

    /**
     * Initially scroll page to have the presentation slot centered.
     */

    presentation = document.querySelector( '.myself' );
    window.scroll(
        presentation.offsetLeft - ( window.innerWidth - presentation.offsetWidth)  / 2,
        presentation.offsetTop - ( window.innerHeight - presentation.offsetHeight)  / 2 );


})();