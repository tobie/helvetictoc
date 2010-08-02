var createFuzzyTime = require('./fuzzyTime').createFuzzyTime,
    timeInWords = require('./timeInWords');

function createClock(time, doc) {
  
  var screens = [
    doc.createElement('div'),
    doc.createElement('div')
  ];
  
  time = time || createFuzzyTime();
  
  doc.body.appendChild(screens[0]);
  doc.body.appendChild(screens[1]);
  
  function getMinutesInWords() {
    return timeInWords.MINUTES[time.getMinutes()];
  }

  function getHoursInWords() {
    return timeInWords.HOURS[time.getHours()];
  }

  function getPreposition() {
    var ff = time.getFuzzyFactor(),
        p = pickOne(timeInWords.PREPOSITIONS[ff]);
    
    return ff === 0 ? pickOne(['', p]) : p;
  }
  
  function pickOne(elements) {
    var index = Math.floor(Math.random() * elements.length);
    return elements[index];
  }

  function isNight() {
    return time.isNight();
  }

  function isDay() {
    return time.isDay();
  }

  function refresh(t) {
    setTime(createFuzzyTime());
  }

  function setTime(t) {
    time = t;
  }

  function isStale(t) {
    return !time.isEqual(t || createFuzzyTime());
  }

  function toHtmlString() {
    var template, sc = timeInWords.SPECIAL_CASES[time.to24HourString()];
    
    if (sc) {
      return sc;
    }
    
    template = timeInWords[time.getMinutes() ? 'template' : 'onTheHourTemplate'];

    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, function(m, m1) {
      switch(m1) {
        case 'p': return getPreposition();
        case 'm': return getMinutesInWords();
        case 'h': return getHoursInWords();
      }
    });
  }
  
  function draw() {
    var s0 = screens[0], s1 = screens[1];
    s0.style.zIndex = 0;
    s1.style.zIndex = 1;
    s0.innerHTML = toHtmlString();
    s0.className = 'screen';
    s1.className = 'screen previous';
    screens.reverse();
    doc.body.className = isNight() ? 'night' : 'day';
  }
  
  function redraw() {
    if (isStale()) {
      refresh();
      draw();
    }
  }

  return {
    getMinutesInWords: getMinutesInWords,
    getHoursInWords: getHoursInWords,
    getPreposition: getPreposition,
    isNight: isNight,
    refresh: refresh,
    setTime: setTime,
    isStale: isStale,
    toHtmlString: toHtmlString,
    draw: draw,
    redraw: redraw
  };
}

exports.createClock = createClock; 