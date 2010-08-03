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