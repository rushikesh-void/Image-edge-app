const path = require('path');
const detectEdges = require('./utils/edgeDetection');

const run = async () => {
  const imagePath = path.join(__dirname, 'uploads', 'test.jpg');

  console.time('edgeDetection');
  const result = await detectEdges(imagePath);
  console.timeEnd('edgeDetection');

  console.log('Width:', result.width);
  console.log('Height:', result.height);
  console.log('Number of border points:', result.borders.length);
  console.log('Area:', result.area);
  console.log('First 5 points:', result.borders.slice(0, 5));
};

run();