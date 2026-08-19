const { runAllTests } = require('../src/utils/testRunner');

const result = runAllTests();
if (result.failed > 0) {
  process.exit(1);
} else {
  console.log('All tests completed successfully!');
  process.exit(0);
}
