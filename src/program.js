var ft = require('./fuzzyTime').createFuzzyTime(),
    c = require('./clock').createClock(ft, document);

c.draw();
setInterval(function() {
  c.redraw();
}, 1000);

window.onresize = c.redraw;
