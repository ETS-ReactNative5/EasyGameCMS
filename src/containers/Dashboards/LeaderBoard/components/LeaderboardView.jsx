import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import Panel from '../../../../shared/components/Panel';

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

  renderTableData() {
    console.log(this.props);
    if (this.props.lsCountryIAP) {
      return this.props.lsCountryIAP.map((nation) => {
        const { UserId, DisplayName, Score, Country } = nation; //destructuring
        return (
          <tr>
            <td>{Country}</td>
            <td>
              <p className='bold-text dashboard__btc'>{DisplayName}</p>
            </td>
            <td>{Score}</td>
          </tr>
        );
      });
    } else {
      return '';
    }
  }

  render() {
    return (
      <Panel xl={6} lg={6} md={12} xs={12} title={this.props.title} subhead=''>
        <Table responsive striped>
          <thead>
            <tr>
              <th>Country</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>{this.renderTableData()}</tbody>
        </Table>
      </Panel>
    );
  }
}
