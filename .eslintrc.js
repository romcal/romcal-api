module.exports = {
  'extends': 'airbnb-base',
  rules: {
    'padded-blocks': ['error', {
      blocks: 'never',
      classes: 'never',
      switches: 'never',
    }, {
      allowSingleLineBlocks: true,
    }]
  }
};
