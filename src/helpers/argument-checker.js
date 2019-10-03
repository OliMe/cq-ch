/**
 *
 * @param {Array} args
 * @param {Object} conf
 */
export function checkArguments (args, functionName, conf) {
  conf = getCfgCreator(functionName, conf)(args);
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

/**
 *
 * @param {string} functionName
 * @param {Function} creator
 * @return {Function}
 */
export function getCfgCreator (functionName, creator) {
  return args => creator(functionName, args);
}
