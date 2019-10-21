module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/src/__mocks__/styleMock.js"
  }
};
