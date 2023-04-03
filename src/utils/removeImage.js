const fs = require('fs');

const removeImage = async (image) => {
  const imageToBeRemoved = `${process.cwd()}${image}`;

  fs.unlink(imageToBeRemoved, function (err) {
    if (err && err.code == 'ENOENT') {
      console.log('Image does not exist!');
    } else if (err) {
      console.log('Error occurred while trying to remove image.');
    } else {
      console.log(`Removed image.`);
    }
  });
};

module.exports = { removeImage };
