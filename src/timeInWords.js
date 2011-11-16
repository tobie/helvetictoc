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
  '1': ['just after', 'right after', 'shortly after']
};

var roundAbout = 'It’s ’round about<br>midnight.';

exports.SPECIAL_CASES = {
  '23:58': roundAbout,
  '23:59': roundAbout,
  '00:00': 'It’s<br> midnight.',
  '00:01': roundAbout,
  '00:02': roundAbout,
  '12:00': 'It’s<br> noon.'
};

exports.onTheHourTemplate = "It’s {{ p }}<br>{{ h }} o’clock.";
exports.template = "It’s {{ p }}<br>{{ m }}<br>{{ h }}.";
