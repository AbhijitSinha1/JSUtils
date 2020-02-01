/**
 * 
 */
const {
  ERROR_TASK_NOT_FUNCTION,
  ERROR_TIMEOUT_NOT_A_NUMBER,
  ERROR_PROCESS_STILL_RUNNING,
  ERROR_PROCESS_NOT_RUNNING,
} = require ('./constants');

const LOGGER = require ('./Logger');

const Log = new LOGGER ();

/**
 * TODO:
 * - worker manager (with UI possibly)
 */
module.exports = function (task, timeout, continueOnError = true) {
  // sanity checks
  // ------------------------------------------------------------------------
  if (!task || !(task instanceof Function)) {
    throw new Error (ERROR_TASK_NOT_FUNCTION);
  }
  if (!timeout || isNaN (timeout)) {
    throw new Error (ERROR_TIMEOUT_NOT_A_NUMBER);
  }

  // private instance variables
  // --------------------------------------------------------------------------
  let isTerminated = true;
  let timer = null;

  // private methods
  // --------------------------------------------------------------------------
  const process = async function () {
    try {
      await task ();
    } catch (e) {
      handleErrors (e);
    }
  };

  const handleErrors = function (e) {
    if (continueOnError) {
      Log.error (e);
      return;
    }
    throw new Error (e);
  };

  // public methods
  // --------------------------------------------------------------------------
  this.start = function () {
    if (!isTerminated) {
      throw new Error (ERROR_PROCESS_STILL_RUNNING);
    }
    timer = setInterval (() => {
      process ();
    }, timeout);
  };

  this.stop = function () {
    if (isTerminated) {
      throw new Error (ERROR_PROCESS_NOT_RUNNING);
    }
    isTerminated = true;
  };

  this.isRunning = function () {
    return !isTerminated;
  };

  this.getInterval = function () {
    return timeout;
  };

  this.setInterval = function (newTimeout) {
    if (!isTerminated) {
      throw new Error (ERROR_PROCESS_STILL_RUNNING);
    }
    timeout = newTimeout;
  };

  // start running on initialization
  // --------------------------------------------------------------------------
  this.start ();
};
