// Match the available season keys available from romcal-api
// with the actual season key provided by romcal.
// TODO:
// - the seasons keys and management in the main romcal library
//   must be reviewed to make them more consistent with their
//   seasons method equivalent, and use cleanest season keys.
// - the Easter Triduum should be managed by romcal,
//   and be excluded from the season of lent.
export default {
  advent: ['Advent'],
  christmastide: ['Christmastide'],
  'christmas-octave': [],
  epiphanytide: [],
  'early-ordinary-time': ['Early Ordinary Time'],
  lent: ['Lent', 'Holy Week'],
  'holy-week': ['Holy Week'],
  'easter-triduum': [],
  eastertide: ['Easter'],
  'easter-octave': [],
  'pentecost-and-week-after': [],
  'later-ordinary-time': ['Later Ordinary Time'],
  'ordinary-time': ['Early Ordinary Time', 'Later Ordinary Time'],
};
