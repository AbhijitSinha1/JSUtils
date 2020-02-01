# JSUtils

This repository contains a set of  javascript utility functions which can be used in other projects

- [Debouncer](./Debouncer.js): takes 3 parameters
    - *task*: the function to be called if the condition is met
    - *timeout*: the wait time before calling the function
    - *limit*: the number of hits before calling the function
    
    the debouncer then lets you `push()` any number of items at any rate you wish. Internally it keeps track of the time since last function trigger and keeps collecting the items in a local array. If the internal timer exceeds the provided timeout or if the number of items in the store exceed the limit the function is called.

- [Logger](./Logger.js): A simple utility to enhance the log information sent out in the application. The logger is initialized as 
    ```js
    const Logger = require ('./Logger');
    const Log = new Logger ();
    ```
    
    and used as
    ```js
    Log.info ('this is an info');
    Log.warn ('this is a warning');
    Log.error ('this is an error');
    ```

    the output is as follows:
    ```shell
    index.js 16:5 | 01/02/2020 11:42:04.429 | this is an info 
    index.js 17:5 | 01/02/2020 11:42:04.457 | this is a warning 
    index.js 18:5 | 01/02/2020 11:42:04.460 | this is an error 
    ```
- [Worker](./Worker.js): This is an extension to the `setInterval()` provided by javasript. It takes 3 parameters:
    - *task*: the function to be called at regular interval
    - *timeout*: the interval at which the task needs to be called
    - *continueOnError*: a flag to determine if the worker should keep running even on encountering errors (defaults to true)

    The worker lets you set cron jobs, stop the job, restart with a different interval.