import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';
import AddNewListingForm from '../containers/NewListingContainer';
import { toggleViewManageListings, toggleViewAddNewListingForm, fetchUpdatedProducts } from '../actions/index';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

// Refactor so that this container doesn't even render a single raw html elemnt like div.
// outsource all view space to presentational components.
class ManageListingsComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    if(!this.props.auth.isAuthenticated) {
      return this.props.redirectToLogin();
    } else {
      this.props.fetchUpdatedProducts();
    }
  }

  render() {
    const { viewAddNewListingForm } = this.props.ui.ManageListings;
    const { sharingItems, ui, popupOpen, popupClose } = this.props;
    const upcomingRent = this.props.upcomingRent();

    const handleRemove = (item) => {
      this.props.removeItem(item);
    };

    const handleCancel = (item) => {
      this.props.cancelItem(item);
    };

    return (
      <div className="manage">
        <div className="manageBanner" />
          <h1>Share Anything</h1>
          <h3>Why not earn some extra cash and help someone out by sharing your stuff!</h3>
          <RaisedButton label="Create New Listing" className="createListing"
          onClick={()=>{
            this.props.toggleViewAddNewListingForm();
          }} />

        {viewAddNewListingForm ?
          <AddNewListingForm/> : null
        }
        <hr />
        <h3>Your Shared Items</h3>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Item</TableHeaderColumn>
                <TableHeaderColumn>Summary</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
                <TableHeaderColumn>Remove?</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
          {sharingItems.map((item, i)=>{
            return (
              <TableRow key={i}>
                <TableRowColumn><Link to={'/listings/' + item._id}>{item.title}</Link></TableRowColumn>
                <TableRowColumn>{item.summary}</TableRowColumn>
                <TableRowColumn>{'$'+item.price + '.00'}</TableRowColumn>
                <TableRowColumn><RaisedButton onClick={() => popupOpen('Are you sure to Remove?', 'remove')} label="Remove Listing" secondary={true}/></TableRowColumn>
                {ui.popup.type === 'remove' &&
                <Dialog
                  actions={
                    <FlatButton
                      label="Confirm"
                      primary={true}
                      onClick={handleRemove.bind(null, item)}
                    />
                  }
                  modal={false}
                  open={ui.popup.open}
                  onRequestClose={popupClose}
                >
                  {ui.popup.content}
                </Dialog>
                }
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
        <hr />
        <h3>Upcoming Rentals</h3>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Item</TableHeaderColumn>
                <TableHeaderColumn>Summary</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Cancel?</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
          {upcomingRent.map((item, i)=>{
            return (
              <TableRow key={i}>
                <TableRowColumn><Link to={'/listings/' + item._id}>{item.title}</Link></TableRowColumn>
                <TableRowColumn>{item.summary}</TableRowColumn>
                <TableRowColumn>{'$'+item.price + '.00'}</TableRowColumn>
                <TableRowColumn>{item.schedule.date.substring(0, 10)}</TableRowColumn>
                <TableRowColumn><RaisedButton onClick={() => popupOpen('Are you sure to Cancel?', 'cancel')} label="Cancel Rental" secondary={true}/></TableRowColumn>
                {ui.popup.type === 'cancel' &&
                <Dialog
                  actions={
                    <FlatButton
                      label="Confirm"
                      primary={true}
                      onClick={handleCancel.bind(null, item)}
                    />
                  }
                  modal={false}
                  open={ui.popup.open}
                  onRequestClose={popupClose}
                >
                  {ui.popup.content}
                </Dialog>
                }
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ManageListingsComponent;
