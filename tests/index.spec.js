import { sendQuery } from '../'

describe('Test for test check', () => {
    it('Test sendQuery', () => {
        expect(sendQuery({ type: test })).toBeInstanceOf(Promise)
    })
});