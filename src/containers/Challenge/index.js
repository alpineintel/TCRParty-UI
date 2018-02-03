import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import UDapp from '../UDapp'
import messages from '../messages'
import methods from '../methods'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Listing from '../../components/Listing'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import {
  selectWallet,
  selectCandidates,
  selectError,
  selectAccount,
  selectAllContracts,
  selectEthjs,
  selectRequest,
} from '../../selectors'
import { sendTransactionRequest, sendTransaction, callRequested } from '../../actions/index';

const ChallengeWrapper = styled.div`
  padding: 1em;
`

class Challenge extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
    }
  }
  componentDidMount() {
    console.log('challenge props', this.props)
    if (!this.props.account) {
      this.props.history.push('/')
    }
  }

  handleOpenUDapp = e => {
    console.log('e', e)
    this.props.onSendTransactionRequest({
      method: e,
    })
    this.setState({
      openModal: true,
    })
  }

  handleClick = (e) => {
    console.log('handle challenge click', e)
    this.props.onSendTransactionRequest(e)
    this.setState({
      openModal: true,
    })
  }

  handleCall = e => {
    console.log('call:', e)
    this.props.onCall(e)
  }

  handleSendTransaction = (e) => {
    console.log('confirm txn:', e)
    this.props.onSendTransaction(e)
  }
  
  render() {
    const { wallet, candidates, request } = this.props
    const reqMeth =
      request.get('method') && !request.get('context')
        ? 'challenge'
        : request.get('method') ? request.get('method') : 'challenge'
    const customMethods = methods[reqMeth].actions || []
    const customWarnings = methods[reqMeth].warning || []

    return (
      <ChallengeWrapper>
        <UserInfo {...this.props} />

        <UDapp
          isOpen={this.state.openModal}
          messages={messages.challenge}
          actions={customMethods}
          defaultMethods={methods.challenge.actions}
          warnings={customWarnings}
          networkId={wallet.get('network')}
          handleSendTransaction={this.handleSendTransaction}
          handleCall={this.handleCall}
          onOpenUDapp={this.handleOpenUDapp}
          {...this.props}
        />

        <H2>
          {'Applicants ('}
          {candidates.size}
          {')'}
        </H2>
        <FlexContainer>
          {candidates.size > 0 &&
            candidates.map(log => (
              <Section key={log.get('listing')}>
                <Listing
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  listing={log.get('listing')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}
                  handleClick={this.handleClick}
                />
              </Section>
            ))}
        </FlexContainer>
      </ChallengeWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSendTransactionRequest: (e) => dispatch(sendTransactionRequest(e)),
    onSendTransaction: (e) => dispatch(sendTransaction(e)),
    onCall: (e) => dispatch(callRequested(e)),
  }
}

const mapStateToProps = createStructuredSelector({
  wallet: selectWallet,
  contracts: selectAllContracts,
  account: selectAccount,
  candidates: selectCandidates,
  error: selectError,
  ethjs: selectEthjs,
  request: selectRequest,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Challenge))
