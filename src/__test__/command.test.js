import command from '../command';
describe('command', () => {
    it('creates commandChannel successfully', () => {
        expect(command(['test_type'], 'test')).toBeInstanceOf(Function);
    });
})
