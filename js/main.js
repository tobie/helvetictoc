(function() {
// modulr.sync.js (c) 2010 codespeaks sàrl
// Freely distributable under the terms of the MIT license.
// For details, see:
//   http://github.com/codespeaks/modulr/blob/master/LICENSE

var require = (function() {
  var _factories = {},
      _modules = {},
      _exports = {},
      _handlers = [],
      _dirStack = [''],
      PREFIX = '__module__', // Prefix identifiers to avoid issues in IE.
      RELATIVE_IDENTIFIER_PATTERN = /^\.\.?\//,
      _forEach;
      
  _forEach = (function() {
    var hasOwnProp = Object.prototype.hasOwnProperty,
        DONT_ENUM_PROPERTIES = [
          'constructor', 'toString', 'toLocaleString', 'valueOf',
          'hasOwnProperty','isPrototypeOf', 'propertyIsEnumerable'
        ],
        LENGTH = DONT_ENUM_PROPERTIES.length,
        DONT_ENUM_BUG = true;
    
    function _forEach(obj, callback) {
      for(var prop in obj) {
        if (hasOwnProp.call(obj, prop)) {
          callback(prop, obj[prop]);
        }
      }
    }
    
    for(var prop in { toString: true }) {
      DONT_ENUM_BUG = false
    }
    
    if (DONT_ENUM_BUG) {
      return function(obj, callback) {
         _forEach(obj, callback);
         for (var i = 0; i < LENGTH; i++) {
           var prop = DONT_ENUM_PROPERTIES[i];
           if (hasOwnProp.call(obj, prop)) {
             callback(prop, obj[prop]);
           }
         }
       }
    }
    
    return _forEach;
  })();
  
  function require(identifier) {
    var fn, mod,
        id = resolveIdentifier(identifier),
        key = PREFIX + id,
        expts = _exports[key];
    
    if (!expts) {
      _exports[key] = expts = {};
      _modules[key] = mod = { id: id };
      
      fn = _factories[key];
      _dirStack.push(id.substring(0, id.lastIndexOf('/') + 1))
      
      try {
        if (!fn) { throw 'Can\'t find module "' + identifier + '".'; }
        if (typeof fn === 'string') {
          fn = new Function('require', 'exports', 'module', fn);
        }
        if (!require.main) { require.main = mod; }
        fn(require, expts, mod);
        _dirStack.pop();
      } catch(e) {
        _dirStack.pop();
        // We'd use a finally statement here if it wasn't for IE.
        throw e;
      }
    }
    return expts;
  }
  
  function resolveIdentifier(identifier) {
    var dir, parts, part, path;
    
    if (!RELATIVE_IDENTIFIER_PATTERN.test(identifier)) {
      return identifier;
    }
    dir = _dirStack[_dirStack.length - 1];
    parts = (dir + identifier).split('/');
    path = [];
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      switch (part) {
        case '':
        case '.':
          continue;
        case '..':
          path.pop();
          break;
        default:
          path.push(part);
      }
    }
    return path.join('/');
  }
  
  function define(descriptors) {
    _forEach(descriptors, function(id, factory) {
      _factories[PREFIX + id] = factory;
    });
  }
  
  require.define = define;
  
  return require;
})();
require.define({
'clock': function(require, exports, module) {
var createFuzzyTime = require('./fuzzyTime').createFuzzyTime,
    timeInWords = require('./timeInWords');

function createClock(doc) {
  
  var time,
      fontSize,
      content,
      screens = [
        doc.createElement('div'),
        doc.createElement('div')
      ],
      clientHeight;
  
  refresh(time);
  
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
  
  function setTime(t) {
    time = createFuzzyTime(t);
  }

  function isStale(t) {
    return !time.isEqual(t || createFuzzyTime());
  }

  function refreshContent(t) {
    setTime(t);
    var template, sc = timeInWords.SPECIAL_CASES[time.to24HourString()];
    
    if (sc) {
      return sc;
    }
    
    template = timeInWords[time.getMinutes() ? 'template' : 'onTheHourTemplate'];

    content = template.replace(/\{\{\s*(\w+)\s*\}\}/g, function(m, m1) {
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
    s0.style.fontSize = fontSize;
    s1.style.fontSize = fontSize;
    s0.innerHTML = content;
    s0.className = 'screen';
    s1.className = 'screen previous';
    screens.reverse();
    doc.body.className = isNight() ? 'night' : 'day';
  }
  
  function setFontSize() {
    fontSize = Math.round(document.documentElement.clientHeight / 8.5) + 'px';
  }
  
  function refreshSize() {
    clientHeight = document.documentElement.clientHeight;
    fontSize = Math.round(clientHeight / 8.5) + 'px';
  }
  
  function wasResized() {
    return clientHeight !== document.documentElement.clientHeight;
  }
  
  function redraw() {
    var redraw = false;
    
    if (isStale()) {
      refreshContent();
      redraw = true;
    }
    
    if (wasResized()) {
      refreshSize();
      redraw = true;
    }
    
    if (redraw) { draw(); }
  }
  
  function refresh(t) {
    refreshContent(t);
    refreshSize();
  }

  return {
    refresh: refresh,
    draw: draw,
    redraw: redraw
  };
}

exports.createClock = createClock; 
}, 
'fuzzyTime': function(require, exports, module) {
function createFuzzyTime(d) {
  d = d || new Date();
  var h = d.getHours(),
      m = d.getMinutes(),
      p = 'am';
      
  function getHours() {
    var r = h;
    if (m > 32) {
      r = r === 23 ? 0 : r + 1;
    }
    
    if (r > 11) {
      r = r - 12;
      p = 'pm';
    }
    
    return r;
  }
  
  function getMinutes() {
    var r = Math.round(m / 5) * 5
    return r === 60 ? 0 : r;
  }
  
  function getPeriod() {
    return p;
  }
  
  function isNight() {
    return h >= 18 || h < 6;
  }
  
  function isDay() {
    return !isNight();
  }
  
  function getFuzzyFactor() {
    var ff = m % 5;
    switch (ff) {
      case 1:
      case 2:
        return 1;
      case 3:
      case 4:
        return -1;
      default:
        return 0;
    }
  }
  
  function isEqual(t) {
    return t.toString() === toString();
  }
  
  function toString() {
    return pad(getHours()) + ':' + 
      pad(getMinutes()) + 'ff' +
      getFuzzyFactor() + ' ' + getPeriod();
  }
  
  function to24HourString() {
    return pad(h) + ':' + pad(m);
  }
  
  function pad(i) {
    return (i > 9 ? '' : '0') + i;
  }
  
  return {
    getPeriod: getPeriod,
    getHours: getHours,
    getMinutes: getMinutes,
    getFuzzyFactor: getFuzzyFactor,
    isNight: isNight,
    isDay: isDay,
    isEqual: isEqual,
    toString: toString,
    to24HourString: to24HourString
  };
}

exports.createFuzzyTime = createFuzzyTime; 
}, 
'timeInWords': function(require, exports, module) {
exports.HOURS = [
  'twelve',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven'
];

exports.MINUTES = {
  '5':  'five past',
  '10': 'ten past',
  '15': 'quarter past',
  '20': 'twenty past',
  '25': 'twenty-five past',
  '30': 'half past',
  '35': 'twenty-five to',
  '40': 'twenty to',
  '45': 'quarter to',
  '50': 'ten to',
  '55': 'five to'
};

exports.PREPOSITIONS = {
  '-1': ['almost', 'nearly'],
  '0': ['exactly', 'precisely', 'now', ''],
  '1': ['after', 'about', 'around']
};

var roundAbout = 'it’s ’round about<br>midnight.';

exports.SPECIAL_CASES = {
  '23:58': roundAbout,
  '23:59': roundAbout,
  '00:00': 'it’s<br> midnight.',
  '00:01': roundAbout,
  '00:02': roundAbout,
  '12:00': 'it’s<br> noon.'
};

exports.onTheHourTemplate = "It’s {{ p }}<br>{{ h }} o’clock.";
exports.template = "It’s {{ p }}<br>{{ m }}<br>{{ h }}.";

}, 
'program': function(require, exports, module) {
var c = require('./clock').createClock(document);
c.draw();
setInterval(c.redraw, 1000);
window.onresize = c.redraw;

}
});
require('program');
})();
