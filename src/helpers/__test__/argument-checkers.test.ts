import {
  checkChannelCreator,
  checkCommandChannel,
  checkRequestChannel,
} from '../argument-checkers';

describe('checkChannelCreator', () => {
  it('checks count of arguments', () => {
    expect(() => checkChannelCreator('testChannel')).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testChannel': 2 arguments required, but 0 present."`,
    );
    expect(() => checkChannelCreator('testChannel', 1)).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testChannel': 2 arguments required, but 1 present."`,
    );
    expect(() => checkChannelCreator('testChannel', 1, 2, 3)).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testChannel': 2 arguments required, but 3 present."`,
    );
    expect(() => checkChannelCreator('testChannel', ['testType'], 'testContext')).not.toThrow();
  });
  it('checks first argument', () => {
    expect(() => checkChannelCreator('testChannel', 1, 2)).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testChannel': first argument must be an Array with at least one element."`,
    );
    expect(() => checkChannelCreator('testChannel', [], 2)).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testChannel': first argument must be an Array with at least one element."`,
    );
    expect(() => checkChannelCreator('testChannel', ['testType'], 'testContext')).not.toThrow();
  });
  it('checks second argument', () => {
    expect(() =>
      checkChannelCreator('testChannel', ['testType'], 2),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testChannel': second argument must be a string."`,
    );
    expect(() => checkChannelCreator('testChannel', ['testType'], 'testContext')).not.toThrow();
  });
});

describe('checkCommandChannel', () => {
  it('checks count of arguments', () => {
    expect(() => checkCommandChannel('testCommandChannel')).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testCommandChannel': 1 arguments required, but 0 present."`,
    );
    expect(() => checkCommandChannel('testCommandChannel', { type: 'test' })).not.toThrow();
  });
  it('checks first argument', () => {
    expect(() => checkCommandChannel('testCommandChannel', 1)).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testCommandChannel': first argument must be an Object with defined property type."`,
    );
    expect(() => checkCommandChannel('testCommandChannel', { type: 'test' })).not.toThrow();
  });
});

describe('checkRequestChannel', () => {
  it('checks count of arguments', () => {
    expect(() => checkRequestChannel('testRequestChannel')).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testRequestChannel': 2 arguments required, but 0 present."`,
    );
  });
  it('checks first argument', () => {
    expect(() =>
      checkRequestChannel('testRequestChannel', 1, 2),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testRequestChannel': first argument must be an Object with defined property type."`,
    );
    expect(() => checkRequestChannel('testRequestChannel', { type: 'test' }, 100)).not.toThrow();
  });
  it('checks second argument', () => {
    expect(() =>
      checkRequestChannel('testRequestChannel', { type: 'test' }, 'not number'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Failed to execute 'testRequestChannel': second argument must be a positive number"`,
    );
    expect(() => checkRequestChannel('testRequestChannel', { type: 'test' }, 123)).not.toThrow();
  });
});
