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
import WinRateBR from './components/WinRateBR';
import CryptotrendsToday from './components/CryptotrendsToday';
import TopTen from './components/TopTen';
//import PlaceOrder from './components/PlaceOrder';
import { deleteCryptoTableData } from '../../../redux/actions/cryptoTableActions';
import { CryptoTableProps } from '../../../shared/prop-types/TablesProps';
import { ThemeProps, RTLProps } from '../../../shared/prop-types/ReducerProps';
import config from '../../../config/appConfig';
import axios from 'axios';
import { data } from 'autoprefixer';
var winRateIndex = 0;
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
    this.state = {
      ccu: 0,
      nru: 0,
      dau: 0,
      pu: 0,
      totalIAP: 0,
      lsIAPCountry: [],
      lsIAPPackage: [],
      lsWinrate: [{ name: 'Stage_1', Win: 0, Lose: 0, Total: 0 }],
    };
  }

  componentDidMount() {
    var dashboardResult;
    var lsIAP = [];
    var lsCountry = [];
    var lsPackage = [];
    var lsRate = [];

    var totalIAP = 0;

    var dicNationIAP = {};

    var dicPackageIAP = {};

    let listPU = {};

    axios
      .post(config.base_url + config.url_gameStats, {
        userID: sessionStorage.getItem('userID'),
      })
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          let data = response.data;
          if (data.status === 'ok') {
            dashboardResult = data.data;
            console.log('statsData', dashboardResult);
            lsIAP = dashboardResult.IAP;
            lsIAP.forEach((item) => {
              let country = item.Currency === '' ? 'Unknow' : item.Currency;
              if (dicNationIAP.hasOwnProperty(country)) {
                dicNationIAP[country].count = dicNationIAP[country].count + 1;
                dicNationIAP[country].total = dicNationIAP[country].total + item.PriceUSD * 1.43;
              } else {
                dicNationIAP[country] = { count: 1, total: item.PriceUSD };
              }

              let pack = item.ProductId;
              if (dicPackageIAP.hasOwnProperty(pack)) {
                dicPackageIAP[pack].count = dicPackageIAP[pack].count + 1;
                dicPackageIAP[pack].total = dicPackageIAP[pack].total + item.PriceUSD * 1.43;
              } else {
                dicPackageIAP[pack] = { count: 1, total: item.PriceUSD * 1.43 };
              }

              totalIAP += item.PriceUSD * 1.43;
            });

            var lsCountryName = Object.keys(dicNationIAP);
            lsCountry = lsCountryName
              .map((item) => {
                var data = {};
                data.name = item;
                data.count = dicNationIAP[item].count;
                data.total = dicNationIAP[item].total;
                return data;
              })
              .sort((a, b) => b.total - a.total);

            lsPackage = Object.keys(dicPackageIAP)
              .map((item) => {
                var data = {};
                data.name = item;
                data.count = dicPackageIAP[item].count;
                data.total = dicPackageIAP[item].total;
                return data;
              })
              .sort((a, b) => b.total - a.total);

            console.log('totalIAP: ' + totalIAP);
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(() => {
        axios
          .post(config.base_url + config.url_winRate, {
            startStage: 0,
            endStage: 501,
          })
          .then(function(response) {
            console.log('__________________________', response);
            if (response.status === 200) {
              let data = response.data;
              console.log('data', data);
              if (data.status === 'ok') {
                lsRate = data.data;
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(() => {
           let DAU = 0;
           let NRU = 0;
           if(Array.isArray(dashboardResult.DAU)) {
            dashboardResult.DAU.forEach(e => { DAU += e });
           }
           if(Array.isArray(dashboardResult.NRU)) {
            dashboardResult.NRU.forEach(e => { NRU += e });  
          }   
            this.setState({
              ccu: dashboardResult.CCU,
              dau: DAU,
              nru: NRU,
              pu: dashboardResult.PU,
              totalIAP: Math.round(totalIAP),
              lsCountryIAP: lsCountry,
              lsPackageIAP: lsPackage,
              lsWinrate: lsRate.map((item) => {
                item.name = 'Stage_' + item.Level;
                item.Total = item.Win + item.Lose;
                if (item.Total > 0) item.rate = Math.round((item.Win / item.Total) * 100);
                else item.rate = 0;
                return item;
              }),
            });
          });
      });
  }

  onDeleteCryptoTableData = (index, e) => {
    const { dispatch, cryptoTable } = this.props;
    e.preventDefault();
    const arrayCopy = [...cryptoTable];
    arrayCopy.splice(index, 1);
    dispatch(deleteCryptoTableData(arrayCopy));
  };

  onStageCallback = (e) => {
    console.log(e.target.name);
    if (e.target.name === 'back') {
      if (winRateIndex !== 0) winRateIndex--;
    } else winRateIndex++;

    var lsRate = [];
    axios
      .post(config.base_url + config.url_winRate, {
        startStage: winRateIndex * 500,
        endStage: (winRateIndex + 1) * 500 + 1,
      })
      .then(function(response) {
        console.log('__________________________', response);
        if (response.status === 200) {
          let data = response.data;
          console.log('data', data);
          if (data.status === 'ok') {
            lsRate = data.data;
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(() => {
        this.setState({
          lsWinrate: lsRate.map((item) => {
            item.name = 'Stage_' + item.Level;
            item.Total = item.Win + item.Lose;
            if (item.Total > 0) item.rate = Math.round((item.Win / item.Total) * 100);
            else item.rate = 0;
            return item;
          }),
        });
      });
  };

  render() {
    const { t, cryptoTable, rtl, theme } = this.props;

    var chartStage;
    if (this.state.lsWinrate.length > 1)
      chartStage = <BtcEth data={this.state.lsWinrate} theme={theme.className} callback={this.onStageCallback} />;

    return (
      <Container className='dashboard'>
        <Row>
          <Col md={12}>
            <h3 className='page-title'>{t('dashboard_crypto.page_title')}</h3>
          </Col>
        </Row>
        <Row>
          <CCU ccu={this.state.ccu} />
          <DAU dau={this.state.dau} />
          <NRU nru={this.state.nru} />
          <PU pu={this.state.pu} />
        </Row>
        <Row>
          <CryptotrendsToday
            total={this.state.totalIAP}
            lsCountryIAP={this.state.lsCountryIAP ? this.state.lsCountryIAP : []}
          />
          <TradeHistory title='IAP by Country' lsCountryIAP={this.state.lsCountryIAP} />
          <TradeHistory title='IAP by Package' lsCountryIAP={this.state.lsPackageIAP} />
          {chartStage}

          <WinRateBR dir={rtl.direction} theme={theme.className} />

          {/* <TopTen
            cryptoTable={cryptoTable}
            onDeleteCryptoTableData={this.onDeleteCryptoTableData}
          /> */}
        </Row>
      </Container>
    );
  }
}

export default connect((state) => ({
  cryptoTable: state.cryptoTable.items,
  rtl: state.rtl,
  theme: state.theme,
}))(withTranslation('common')(CryptoDashboard));
