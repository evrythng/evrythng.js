const { version } = require('../package.json');
const { readFileSync } = require('fs');

/**
 * The main function.
 */
const main = () => {
  const readMeData = readFileSync(`${__dirname}/../README.md`, 'utf8');
  const cdnUrlLine = readMeData.split('\n').find(p => p.includes('cloudfront.net'));

  if (!cdnUrlLine.includes(version)) {
    throw new Error('README.md CDN URL version does not match package.json!');
  }

  console.log(`version: ${version}\ntag: ${cdnUrlLine}`);
};

main();
