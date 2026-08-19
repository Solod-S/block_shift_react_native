import { runAllTests } from '../src/utils/testRunner.js';

const result = runAllTests();
if (result.failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed with zero errors!');
  process.exit(0);
}
