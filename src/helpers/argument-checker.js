/**
 * Checks function arguments.
 * @param {Array} args Arguments.
 * @param {string} functionName Function name.
 * @param {function(string, Array):Object} confCreator Validation configuration creator.
 * @throws {Error} Throws validation error.
 */
export function checkArguments (args, functionName, confCreator) {
  const conf = confCreator(functionName, args);
  Array.from(args).forEach((arg, index) => {
    const argCheckConfList = conf[index];
    if (argCheckConfList && argCheckConfList instanceof Array) {
      argCheckConfList.forEach(argCheckConf => {
        if (
          typeof argCheckConf === 'object'
          && argCheckConf.validator instanceof Function
          && argCheckConf.error instanceof Error
        ) {
          if (!argCheckConf.validator(arg, args)) {
            throw argCheckConf.error;
          }
        }
      });
    }
  });
}
