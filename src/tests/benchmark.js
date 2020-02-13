const LOGGER = require ('../services/Logger');
const Log = new LOGGER ();

const message = 'hi';
const limit = 100000;

const standardStartTime = Date.now ();
for (var i = 0; i < limit; i++) {
  console.log (message);
}
const standardDuration = Date.now () - standardStartTime;

const testStartTime = Date.now ();
for (var i = 0; i < limit; i++) {
  Log.info (message);
}
const testDuration = Date.now () - testStartTime;

Log.info ({
  standardDuration,
  testDuration,
  diff: (testDuration - standardDuration) / standardDuration,
});

/**
 * limit: 100000;
 * {"standardDuration":1541,"testDuration":10325,"diff":5.700194678780013}
 * 
 * limit: 100000;
 * {"standardDuration":1269,"testDuration":9593,"diff":6.559495665878645}
 * 
 * limit: 100000;
 * {"standardDuration":1278,"testDuration":9918,"diff":6.76056338028169}
 * 
 * limit: 10000;
 * {"standardDuration":254,"testDuration":1278,"diff":4.031496062992126}
 * 
 * limit: 10000;
 * {"standardDuration":177,"testDuration":1154,"diff":5.519774011299435}
 * 
 * limit: 10000;
 * {"standardDuration":202,"testDuration":993,"diff":3.9158415841584158}
 * 
 * limit: 10000;
 * {"standardDuration":222,"testDuration":1095,"diff":3.9324324324324325} 
 */
