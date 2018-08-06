import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import { withStyles } from '@material-ui/core/styles'

import { colors } from 'global-styles'
import { selectSidePanelListing, selectSidePanelMethod } from 'modules/listings/selectors'
import * as actions from 'modules/transactions/actions'

import toJS from 'components/toJS'
import ListingCard from './ListingCard'

const ListingsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 90vw;
  margin: 20px auto 0;
`

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.contentBackground,
    boxShadow: '0 0 0 0',
  },
  tableWrapper: {
    // overflowX: 'auto',
    padding: '0',
  },
  appBar: {
    boxShadow: '0 0 0 0',
    borderBottom: `.5px solid ${colors.paleGrey}`,
  },
  tab: {
    '& > span': {
      '& > span': {
        paddingLeft: '5px',
      },
    },
    fontWeight: 'bold',
  },
  caption: {
    display: 'none',
  },
})

class Listings extends Component {
  render() {
    const { listingType, visibleListings, onOpenSidePanel } = this.props

    console.log('this.props:', this.props)

    return (
      <ListingsContainer>
        {Object.keys(visibleListings).map(li => (
          <div key={li}>
            <ListingCard
              one={visibleListings[li]}
              listingType={listingType}
              openSidePanel={onOpenSidePanel}
              updateTrigger={
                listingType === 'faceoffs'
                  ? visibleListings[li].revealExpiry.expired
                  : visibleListings[li].listingType === 'applications'
                    ? visibleListings[li].appExpiry.expired
                    : false
              }
              revealTrigger={
                listingType === 'faceoffs'
                  ? visibleListings[li].commitExpiry.expired
                  : false
              }
              claimRewardTrigger={false}
            />
          </div>
        ))}
      </ListingsContainer>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  sidePanelListing: selectSidePanelListing,
  sidePanelMethod: selectSidePanelMethod,
})

const withConnect = connect(
  mapStateToProps,
  {
    onOpenSidePanel: actions.openSidePanel,
  }
)

export default compose(withStyles(styles)(withConnect(toJS(Listings))))
