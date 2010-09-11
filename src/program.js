var c = require('./clock').createClock(document);
c.draw();
setInterval(c.redraw, 1000);
window.onresize = c.redraw;
