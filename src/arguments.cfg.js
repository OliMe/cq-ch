//@flow
export const subscribeCfg = (functionName: string, args: Array<any>): Array<Array<Object>> => [
    [
        {
            validator: ([, list: Array<any>]) => {
                return list && list.length && list.length >= 1
            },
            error: new TypeError (
                `Failed to execute '${functionName}': 2 arguments required, but ${args.length} present.`
            ),
        },
        {
            validator: argument => {
                argument && typeof argument === 'string'
            },
            error: new TypeError (
                `Failed to execute '${functionName}': first argument must be a string.`
            ),
        }
    ],
    [
        {
            validator: ([, list: Array<any>]) => {
                return list && list.length && list.length === 2
            },
            error: new TypeError (
                `Failed to execute '${functionName}': 2 arguments required, but only ${args.length} present.`
            ),
        },
        {
            validator: argument => {
                argument && typeof argument === 'function'
            },
            error: new TypeError (
                `Failed to execute '${functionName}': second argument must be a function.`
            ),
        }
    ]
]

export const sendCfg = (functionName: string, args: Array<any>): Array<Array<Object>> => [
    [
        {
            validator: ([, list: Array<any>]) => {
                return list && list.length && list.length >= 1
            },
            error: new TypeError (
                `Failed to execute '${functionName}': 2 arguments required, but only ${args.length} present.`
            ),
        },
    ]
]