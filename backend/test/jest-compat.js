// Node 25 removed the legacy SlowBuffer export that the jsonwebtoken dependency
// still uses. Keep the dependency's constant-time comparison available while
// the test process loads the application modules.
const buffer = require('buffer');

if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
