import { checkArguments } from '../argument-checker';

describe('checkArguments', () => {
  it('should check values by validator function and throw errors if validation was failed.', () => {
    const testConf = [
      [
        {
          validator: () => false,
          error: new Error('test error'),
        },
      ],
    ];
    const confCreator = jest.fn(() => testConf);
    const testValue = 1;
    expect(() => checkArguments([testValue], 'test', confCreator)).toThrow(testConf[0][0].error);
  });
  it('should`t throw errors if all validation functions return true.', () => {
    const testConf = [
      [
        {
          validator: () => true,
          error: new Error('test error'),
        },
      ],
    ];
    const confCreator = jest.fn(() => testConf);
    const testValue = 1;
    expect(() => checkArguments([testValue], 'test', confCreator)).not.toThrow(testConf[0][0].error);
  });
  it('should not validate arguments if check configuration is not valid.', () => {
    const invalidTestConf = [undefined];
    const confCreator = jest.fn(() => invalidTestConf);
    const testValue = 1;
    expect(() => checkArguments([testValue], 'test', confCreator)).not.toThrow();
    const anotherInvalidTestConf = [[{
      validator: 123,
      error: 123,
    }]];
    const anotherConfCreator = jest.fn(() => anotherInvalidTestConf);
    expect(() => checkArguments([testValue], 'test', anotherConfCreator)).not.toThrow();
  });
});
