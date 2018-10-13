// @flow
export default class TargetWrapper {
    target: any
    /**
     * 
     */
    constructor() {
        this.target = this.createTarget()
    }
    /**
     * @returns {Object}
     */
    createTarget (): Object {
        return {}
    }
}
