import get from 'lodash/get'
import React, { Component } from 'react'
import SettlementForm from '../components/settlement-form'
import { connect } from 'react-redux'
import { Creators as SettlementAction } from '../redux/settlement'
import { Creators as AppAction } from '../redux/app'

export class SettlementFormConnector extends Component {
  /** @inheritDoc */
  componentWillMount() {
    this.init()
  }

  /** @inheritDoc */
  init() {
    this.props.appMounted()
  }

  /** @inheritDoc */
  render() {
    return (<SettlementForm {...this.props} />)
  }
}
/** @inheritDoc */
const mapDispatchToProps = dispatch => {
  return {
    getSettlementList: (name, id) => dispatch(SettlementAction.request(name, id)),
    setSettlement: (settlement) => dispatch(SettlementAction.setCurrent(settlement)),
    appMounted: () => dispatch(AppAction.mounted()),
  }
}
/**
 * Search settlement by ID in list 
 * @param {Array} list List of settlements 
 * @param {number} id Settlement ID
 */
const getSettlement = (list, id = 0) => {
  if (list) {
    let result = list[id]
    if (id) {
      result = list.find(value => value.id = id)
    }
    return result
  }
}
/** @inheritDoc */
const mapStateToProps = state => {
  return {
    ...state,
    settlement: {
      ...get(state, 'settlement', null),
      current: { ...(get(state, 'settlement.current', null) || getSettlement(get(state, 'settlement.list', null))) },
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettlementFormConnector)