/**
 * The role of a debouncer is to halt a particular task from running until one of two conditions is met
 * - sufficient number of requests have been made for the task
 * - sufficient time has passed
 * 
 * the debouncer can be used in a lot of places, but here is a real world exaple where a debouncer can be used
 * 
 * Ex: suppose you have a secretary whose job is to receive phone calls for you. 
 * Since you are a busy person, you have instructed the secretary to not pass each and every calls to you, instead keep a note of all the calls received
 * Only pass on the call at the end of every day OR if the number of incoming calls exceed, say, 200.
 * - The rationale is that every day your secretary will tell you about all the calls you received that day, but if you start overflowing with calls, then something must be wrong and you would want to be informed about it immediately
 * - Your secretary here acts as a debouncer for you
 */

const {
  ERROR_TASK_NOT_FUNCTION,
  ERROR_TIMEOUT_NOT_A_NUMBER,
  ERROR_LIMIT_NOT_A_NUMBER,
  ERROR_PROCESS_STILL_RUNNING,
  ERROR_PROCESS_NOT_RUNNING,
} = require ('./constants');

const LOGGER = require ('./Logger');

const Log = new LOGGER ();

module.exports = function (task, timeout, limit) {
  // sanity checks
  // ------------------------------------------------------------------------
  if (!task || !(task instanceof Function)) {
    throw new Error (ERROR_TASK_NOT_FUNCTION);
  }
  if (!timeout || isNaN (timeout)) {
    throw new Error (ERROR_TIMEOUT_NOT_A_NUMBER);
  }
  if (!limit || isNaN (limit)) {
    throw new Error (ERROR_LIMIT_NOT_A_NUMBER);
  }

  // private instance variables
  // --------------------------------------------------------------------------
  const array = [];
  let isTerminated = true;
  let timer = null;
  let startTime = 0;

  // private methods
  // --------------------------------------------------------------------------
  const process = async function () {
    clearInterval (timer);
    timer = null;
    const copy = array.splice (0, array.length);
    try {
      await task (copy);
    } catch (e) {
      handleErrors (e);
    }
  };

  const handleErrors = function (e) {
    Log.error (e);
  };

  const printMessage = function (message) {
    const duration = Date.now () - startTime;
    Log.info (
      `${message} | SIZE: ${array.length}/${limit} | TIME: ${duration}/${timeout}`
    );
  };

  // public methods
  // --------------------------------------------------------------------------
  this.start = function () {
    if (!isTerminated) {
      throw new Error (ERROR_PROCESS_STILL_RUNNING);
    }
    isTerminated = false;
  };

  this.stop = function () {
    if (isTerminated) {
      throw new Error (ERROR_PROCESS_NOT_RUNNING);
    }
    isTerminated = true;
    printMessage ('PROCESS ENDING');
    process ();
  };

  this.isRunning = function () {
    return !isTerminated;
  };

  this.push = function (item) {
    if (isTerminated) {
      throw new Error (ERROR_PROCESS_NOT_RUNNING);
    }
    array.push (item);
    if (timer == null) {
      startTime = Date.now ();
      timer = setInterval (() => {
        printMessage ('TIMER ELAPSED ');
        process ();
      }, timeout);
    }
    if (array.length >= limit) {
      printMessage ('LIMIT REACHED ');
      process ();
    }
  };

  this.getInterval = function () {
    return timeout;
  };

  this.getLimit = function () {
    return limit;
  };

  this.setInterval = function (newTimeout) {
    if (!isTerminated) {
      throw new Error (ERROR_PROCESS_STILL_RUNNING);
    }
    timeout = newTimeout;
  };

  this.setLimit = function (newLimit) {
    if (!isTerminated) {
      throw new Error (ERROR_PROCESS_STILL_RUNNING);
    }
    limit = newLimit;
  };

  // start running on initialization
  // --------------------------------------------------------------------------
  this.start ();
};
