module.exports = {
  execSync: jest.fn(() => { throw Error(); }),
};
