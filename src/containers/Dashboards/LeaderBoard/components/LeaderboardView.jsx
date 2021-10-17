import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Table,  DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import Panel from '../../../../shared/components/Panel';
import { Link } from 'react-router-dom';
import DotsHorizontalIcon from 'mdi-react/DotsHorizontalIcon';
import axios from 'axios';
import config from '../../../../config/appConfig';

const DropDownMore = ({ index, handleDeleteRow }) => (
  <UncontrolledDropdown className="dashboard__table-more">
    <DropdownToggle>
      <p><DotsHorizontalIcon /></p>
    </DropdownToggle>
    <DropdownMenu className="dropdown__menu">
      {/* <Link to={`/dashboard_crypto/edit/${index}`}><DropdownItem>View</DropdownItem></Link> */}
      <DropdownItem>View</DropdownItem>
      <DropdownItem onClick={handleDeleteRow}>Delete</DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);



//export default withTranslation('common')(TradeHistory);
export default class LeaderboardView extends PureComponent {
  static propTypes = {
    dir: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      activeIndex: 0,
    };
  }

  onDeleteCryptoTableData = (index, e) => {
 
    e.preventDefault();
    console.log(index,e);

    console.log(index,this.props.lsCountryIAP[index].UserId);

    axios
    .post(config.base_url + config.url_deleteLeaderBoard, {
      UserId: this.props.lsCountryIAP[index].UserId,
      LeaderbardName:'Survival'
    })
    .then(function(response) {
      console.log(response);
      if (response.status === 200) {
        let data = response.data;
        if (data.status === 'ok') {
          console.log(response.data);
          this.props.lsCountryIAP.splice(index,1);
        }
      }
    })
    .catch(function(error) {
      console.log(error);
    })


  };

  
  renderTableData() {

    if (this.props.lsCountryIAP) {
      return this.props.lsCountryIAP.map((nation,index) => {
        const { UserId, DisplayName, Score, Country,Kill,TimePlay } = nation; //destructuring
        return (
          <tr>
             <td>{index +1}</td>
            <td>{UserId}</td>
            <td>{Country}</td>
            <td>
              <p className='bold-text dashboard__btc'>{DisplayName}</p>
            </td>
            <td>{Score}</td>
            <td>{Kill}</td>
            <td>{TimePlay}</td>
            <td>
              <DropDownMore index={index} handleDeleteRow={e => this.onDeleteCryptoTableData(index, e)} /> 
              {/*  */}
            </td>
          </tr>
        );
      });
    } else {
      return '';
    }
  }


  
  render() {
    return (
      <Panel xl={12} lg={12} md={12} xs={12} title={this.props.title} subhead=''>
        <Table responsive striped>
          <thead>
            <tr>
            <th></th>
            <th>UserId</th>
              <th>Country</th>
              <th>Name</th>
              <th>Score</th>
              <th>Kills</th>
              <th>TimePlay</th>
            </tr>
          </thead>
          <tbody>{this.renderTableData()}</tbody>
        </Table>
      </Panel>
    );
  }
}