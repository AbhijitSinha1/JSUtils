const WORKER = require ('../services/Worker');
const LOGGER = require ('../services/Logger');
const DEBOUNCER = require ('../services/Debouncer');

const Log = new LOGGER ();

const timeLimit = 783;
const sizeLimit = 645;

const debouncerTask = array => {};
const debouncer = new DEBOUNCER (debouncerTask, timeLimit, sizeLimit);

const workerTask = () => debouncer.push ('ping');
new WORKER (workerTask, 1);

Log.info ('this is an info');
Log.warn ('this is a warning');
Log.error ('this is an error');
