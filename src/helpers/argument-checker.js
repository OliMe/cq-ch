// @flow
/**
 * 
 * @param {Array} args 
 * @param {Object} conf 
 */
export function checkArguments (args: Array<any>, conf: Array<Array<Object>>): void {
    args.forEach((arg: any, index: number) => {
        const argCheckConfList: Array<Object> = conf[index]
        if (argCheckConfList && argCheckConfList instanceof Array) {
            argCheckConfList.forEach(argCheckConf => {
                if (
                    typeof argCheckConf === 'object' && 
                    argCheckConf.validator instanceof Function && 
                    argCheckConf.error instanceof Error
                ) {
                    if (!argCheckConf.validator(arg, args)) {
                        throw argCheckConf.error
                    }
                }
            })
        }
    })
}
/**
 * 
 * @param {string} functionName 
 * @param {Function} creator
 * @returns {Function}
 */
export function getCfgCreator (functionName: string, creator: Function): Function {
    return args => creator(functionName, args)
}