import React, { PureComponent } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CCU from './components/CCU';
import DAU from './components/DAU';
import NRU from './components/NRU';
import PU from './components/PU';
import TradeHistory from './components/TradeHistory';
import BtcEth from './components/BtcEth';
import CryptotrendsToday from './components/CryptotrendsToday';
import TopTen from './components/TopTen';
import PlaceOrder from './components/PlaceOrder';
import { deleteCryptoTableData } from '../../../redux/actions/cryptoTableActions';
import { CryptoTableProps } from '../../../shared/prop-types/TablesProps';
import { ThemeProps, RTLProps } from '../../../shared/prop-types/ReducerProps';
import  config from '../../../config/appConfig'; 
import axios from 'axios';

class CryptoDashboard extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    cryptoTable: CryptoTableProps.isRequired,
    dispatch: PropTypes.func.isRequired,
    rtl: RTLProps.isRequired,
    theme: ThemeProps.isRequired,
  };

  constructor() {
    super();
    this.state = 
    { ccu:0,nru:0,dau:0,pu:0, }
    
  }
  componentDidMount() {

    var dashboarResult;
    axios.post(
      config.base_url+config.url_gameStats,
      {
        userID:sessionStorage.getItem('userID')
      }
    ).then(function (response) {
      console.log(response);
      if(response.status === 200)
      {
        let data = response.data
        console.log('data',data);
        if(data.status === 'ok')
        {
          dashboarResult = data.data;
          console.log('statsData',dashboarResult);

          
        }
      }
      
    })
    .catch(function (error) {
      console.log(error);
    }).then(
      ()=>{
        this.setState({
          ccu:dashboarResult.CCU,
          dau:dashboarResult.DAU,
          nru:dashboarResult.NRU,
        })
      }
    );
  }
  

  onDeleteCryptoTableData = (index, e) => {
    const { dispatch, cryptoTable } = this.props;
    e.preventDefault();
    const arrayCopy = [...cryptoTable];
    arrayCopy.splice(index, 1);
    dispatch(deleteCryptoTableData(arrayCopy));
  };

  render() {
    const {
      t, cryptoTable, rtl, theme,
    } = this.props;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <h3 className="page-title">{t('dashboard_crypto.page_title')}</h3>
          </Col>
        </Row>
        <Row>
          <CCU ccu={this.state.ccu}  />
          <DAU dau={this.state.dau} />
          <NRU nru={this.state.nru} />
          <PU dir={rtl.direction} />
        </Row>
        <Row>
          <TradeHistory />
          <BtcEth
            dir={rtl.direction}
            theme={theme.className}
          />
          <CryptotrendsToday dir={rtl.direction} />
          <PlaceOrder />
          <TopTen cryptoTable={cryptoTable} onDeleteCryptoTableData={this.onDeleteCryptoTableData} />
        </Row>
      </Container>
    );
  }
}

export default connect(state => ({
  cryptoTable: state.cryptoTable.items,
  rtl: state.rtl,
  theme: state.theme,
}))(withTranslation('common')(CryptoDashboard));
