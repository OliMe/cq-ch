import execute from '../execute'
import { TYPE_COMMAND } from '../constants'
import command from "../command";

describe('execute', () => {
    it('creates execute channel successfully', () => {
        expect(execute(['test_type'], 'test')).toBeInstanceOf(Function)
    })
    it('creates execute channel unsuccessfully', () => {
        const createChannelWithoutArguments = () => execute()
        const createChannelWithFirstIncorrectArgument = () => execute('not array')
        const createChannelWithFirstArgumentEmptyArray = () => execute([], 'test')
        const createChannelWithoutSecondArgument = () => execute(['test_type'])
        const createChannelWithSecondIncorrectArgument = () => execute(['test_type'], 200)
        expect(createChannelWithoutArguments).toThrowErrorMatchingSnapshot()
        expect(createChannelWithFirstIncorrectArgument).toThrowErrorMatchingSnapshot()
        expect(createChannelWithFirstArgumentEmptyArray).toThrowErrorMatchingSnapshot()
        expect(createChannelWithoutSecondArgument).toThrowErrorMatchingSnapshot()
        expect(createChannelWithSecondIncorrectArgument).toThrowErrorMatchingSnapshot()
    })
})
