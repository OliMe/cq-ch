import React, { Component } from 'react'
import SettlementForm from '../components/settlement-form'
import { connect } from 'react-redux'
import { Creators as SettlementAction } from '../redux/settlement'

export class SettlementFormConnector extends Component {
    /** @inheritDoc */
    componentWillMount () {
      this.init()
    }
  
    /** @inheritDoc */
    init () {
      this.props.getSettlementList()
    }
  
    /** @inheritDoc */
    render () {
      return (<SettlementForm {...this.props} />)
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      getSettlementList: (name, id) => dispatch(SettlementAction.request(name, id)),
    }
  }

  const getSettlement = (list, id = null) => {
    let result = list[0]
    if (id) {
      result = list.find(value => value.id = id)
    }
    return result
  }
  
  const mapStateToProps = state => ({
    settlement: getSettlement(state.list, state.current)
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SettlementFormConnector)