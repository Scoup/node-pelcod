(function() {
    $(document).ready(function() {
        socket = io.connect(window.location.hostname);

        var startX = 0;
        var startY = 0;
        var timer;

        return $("#touch").swipe({
            swipeStatus: function(ev, phase, direction, distance, duration, fingerCount) {

                if(phase == 'start') {
                    if (ev.changedTouches) {
                        startX = ev.changedTouches[0].clientX;
                        startY = ev.changedTouches[0].clientY;
                    } else {
                        startX = ev.clientX;
                        startY = ev.clientY;
                    }
                    var startTime = new Date().getTime();
                }

                if(phase == 'move' || phase == 'end') {
                    if (ev.changedTouches) {
                      var x = ev.changedTouches[0].clientX;
                      var y = ev.changedTouches[0].clientY;
                    } else {
                      var x = ev.clientX;
                      var y = ev.clientY;
                    }
                    var t = new Date().getTime();
                    clearTimeout(timer)
                    if(Math.abs(startX - x) > 10 || Math.abs(startY - y) > 10) {
                        socket.emit('change', {
                            pan: startX - x,
                            tilt: startY - y
                        });
                        // console.log('pan', startX - x, 'tilt', startY - y);
                        startX = x;
                        startY = y;
                    } 

                    timer = setTimeout(function(){
                        socket.emit('stop');
                        // console.log('stop');
                    }, 200)
                    
                }

            }
        });
    });
}).call(this);