export const channelCreatorCfg = (functionName, args) => [
  [
    {
      validator: (argument, list) => list && list.length && list.length >= 1,
      error: new TypeError(
        `Failed to execute '${functionName}': 2 arguments required, but only ${args.length} present.`
      ),
    },
    {
      validator: argument => Array.isArray(argument) && argument.length,
      error: new TypeError(
        `Failed to execute '${functionName}': first argument must be an Array with at least one element.`
      ),
    },
  ],
  [
    {
      validator: (argument, list) => list && list.length && list.length === 2,
      error: new TypeError(
        `Failed to execute '${functionName}': 2 arguments required, but ${args.length} present.`
      ),
    },
    {
      validator: argument => typeof argument === 'string',
      error: new TypeError(
        `Failed to execute '${functionName}': second argument must be a string.`
      ),
    },
  ],
];

export const commandChannelCfg = (functionName, args) => [
  [
    {
      validator: (argument, list) => list && list.length && list.length === 1,
      error: new TypeError(
        `Failed to execute '${functionName}': 1 arguments required, but ${args.length} present.`
      ),
    },
    {
      validator: argument => typeof argument === 'object' && typeof argument.type === 'string',
      error: new TypeError(
        `Failed to execute '${functionName}': first argument must be an Object with defined property type.`
      ),
    },
  ],
];

export const requestChannelCfg = (functionName, args) => [
  [
    {
      validator: (argument, list) => list && list.length && list.length >= 1,
      error: new TypeError(
        `Failed to execute '${functionName}': 2 arguments required, but ${args.length} present.`
      ),
    },
    {
      validator: argument => typeof argument === 'object' && typeof argument.type === 'string',
      error: new TypeError(
        `Failed to execute '${functionName}': first argument must be an Object with defined property type.`
      ),
    },
  ],
  [
    {
      validator: (argument, list) => list && list.length && list.length === 2,
      error: new TypeError(
        `Failed to execute '${functionName}': 2 arguments required, but ${args.length} present.`
      ),
    },
    {
      validator: argument => typeof argument === 'number' && argument > 0,
      error: new TypeError(
        `Failed to execute '${functionName}': second argument must be a positive number`
      ),
    },
  ],
];
