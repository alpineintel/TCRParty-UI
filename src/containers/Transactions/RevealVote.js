import React, { Component } from 'react'
// import translate from 'translations'

import { baseToConvertedUnit } from 'libs/units'

import Button from 'components/Button'
import { SideSplit, SideText } from 'containers/Transactions/components'
import { MarginDiv, FileInput } from 'components/StyledHome'

import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import { getLocal } from '../../utils/_localStorage'

export default class RevealVote extends Component {
  state = {
    didCommit: false,
    didReveal: false,
    numTokens: '',
    votesFor: '',
    votesAgainst: '',
    file: {},
  }

  componentDidMount() {
    this.getCommitHash()
    this.handleGetLocal()
  }
  handleGetLocal = async () => {
    const key = `${this.props.selectedOne.challengeID}-${
      this.props.selectedOne.listingID
    }`
    // const file = e.target.files[0]
    const file = await getLocal(key)
    console.log('file:', file)
    this.setState({
      file,
    })
  }

  handleRevealVote = async () => {
    console.log(this.state)
    const { file } = this.state
    this.props.handleRevealVote(file.pollID, file.voteOption, file.salt)
  }

  getCommitHash = async () => {
    console.log('this.props:', this.props)
    const numTokensRaw = (await this.props.voting.getNumTokens(
      this.props.account,
      this.props.selectedOne.challengeID
    ))['0']
    const numTokens = baseToConvertedUnit(
      numTokensRaw.toString(),
      this.props.tcr.tokenDecimals
    )

    const didCommit = (await this.props.voting.didCommit(
      this.props.account,
      this.props.selectedOne.challengeID
    ))['0']
    const didReveal = (await this.props.voting.didReveal(
      this.props.account,
      this.props.selectedOne.challengeID
    ))['0']

    this.setState({
      didCommit,
      didReveal,
      numTokens,
    })
  }

  render() {
    const { opened, closeSidePanel, balances, handleFileInput, selectedOne } = this.props

    return (
      <SidePanel title="Reveal Vote" opened={opened} onClose={closeSidePanel}>
        <SideSplit
          leftTitle={'Voting Rights'}
          leftItem={balances.votingRights}
          rightTitle={'Locked Tokens'}
          rightItem={balances.lockedTokens}
        />
        <SideSplit
          leftTitle={'Votes For'}
          leftItem={selectedOne.votesFor}
          rightTitle={'Votes Against'}
          rightItem={selectedOne.votesAgainst}
        />
        <SideSplit
          leftTitle={'Tokens you committed'}
          leftItem={this.state.numTokens}
          rightTitle={'POLL ID'}
          rightItem={selectedOne && selectedOne.challengeID}
        />

        <SideText
          small
          text={`Reveal for vote: ${selectedOne && selectedOne.listingID}`}
        />

        <SidePanelSeparator />

        {this.state.didReveal ? (
          <SideText
            text={`You have already revealed with ${
              this.state.numTokens
            } tokens for this poll`}
          />
        ) : this.state.didCommit ? (
          <div>
            <SideText
              text={
                'In order to reveal your previously committed vote, upload the JSON commit file'
              }
            />

            <FileInput type="file" name="file" onChange={handleFileInput} />
            <MarginDiv>
              <Button
                methodName="revealVote"
                onClick={this.handleRevealVote}
                mode="strong"
                wide
              >
                {'Reveal Vote'}
              </Button>
            </MarginDiv>
          </div>
        ) : (
          <SideText text={'You have not voted in this poll.'} />
        )}
      </SidePanel>
    )
  }
}