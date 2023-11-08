module.exports = {
  // 预设
  preset: '@vue/cli-plugin-unit-jest',
  // 多于一个测试文件运行时展示每个测试用例测试通过情况
  verbose: true,
  // 参数指定只要有一个测试用例没有通过，就停止执行后面的测试用例
  bail: true,
  // 告诉jest需要解析的文件
  moduleFileExtensions: [
      'js',
      'ts',
      'vue'
  ],
  // 告诉jest针对不同类型的文件如何转义
  transform: {
    "^.+\.js$": "babel-jest",
    "^.+\.vue$": "@vue/vue2-jest"
  },
  // 告诉jest在编辑的过程中可以忽略哪些文件，默认为node_modules下的所有文件
  transformIgnorePatterns: [
      '<rootDir>/node_modules'
  ],
  // 别名，同webpack中的alias
  moduleNameMapper: {
      '^src(.*)$': '<rootDir>/src/$1',
      '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [
      'jest-serializer-vue'
  ],
  // 告诉jest去哪里找我们编写的测试文件
  testMatch: [
      '**/__tests__/unit/**/*.spec.[jt]s?(x)',
      '**/__tests__/**/*.spec.[jt]s?(x)'
  ]
};