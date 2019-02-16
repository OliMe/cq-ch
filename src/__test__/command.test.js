import command from '../command';
describe('command', () => {
    it('creates commandChannel successfully', () => {
        expect(command(['test_type'], 'test')).toBeInstanceOf(Function);
    });
    it('creates commandChannel unsuccessfully', () => {
        const createChannelWithoutArguments = () => command()
        const createChannelWithFirstIncorrectArgument = () => command('not array')
        expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot();
        expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot();
    });
})
