module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPathIgnorePatterns: ["node_modules"],
  maxWorkers: 4,
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
