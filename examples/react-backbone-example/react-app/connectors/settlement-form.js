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
      this.props.getSettlement()
    }
  
    /** @inheritDoc */
    render () {
      return (<SettlementForm {...this.props} />)
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      getSettlement: id => dispatch(SettlementAction.getSettlement(id)),
      getSettlementList: (name, id) => dispatch(SettlementAction.request(name, id)),
    }
  }
  
  const mapStateToProps = state => ({ ...state })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SettlementFormConnector)