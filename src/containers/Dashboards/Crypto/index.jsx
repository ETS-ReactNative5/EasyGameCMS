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
import config from '../../../config/appConfig';
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
    this.state = {
      ccu: 0,
      nru: 0,
      dau: 0,
      pu: 0,
      totalIAP: 0,
      lsIAPCountry: [],
      lsIAPPackage: [],
      lsWinrate:[],
    };
  }
  componentDidMount() {
    var dashboarResult;
    var lsIAP = [];
    var lsCountry = [];
    var lsPackage = [];
    var lsRate = [];

    var totalIAP = 0;

    var dicNationIAP = {};

    var dicPackageIAP = {};

    axios
      .post(config.base_url + config.url_gameStats, {
        userID: sessionStorage.getItem('userID'),
      })
      .then(function(response) {
        console.log(response);
        if (response.status === 200) {
          let data = response.data;
          console.log('data', data);
          if (data.status === 'ok') {
            dashboarResult = data.data;
            console.log('statsData', dashboarResult);
            lsIAP = dashboarResult.IAP;
            lsIAP.forEach((item) => {
              let country = item.Country === '' ? 'Unknow' : item.Country;
              if (dicNationIAP.hasOwnProperty(country)) {
                dicNationIAP[country].count = dicNationIAP[country].count + 1;
                dicNationIAP[country].total =
                  dicNationIAP[country].total + item.price;
              } else {
                dicNationIAP[country] = { count: 1, total: item.price };
              }

              let pack = item.PackageID;
              if (dicPackageIAP.hasOwnProperty(pack)) {
                dicPackageIAP[pack].count = dicPackageIAP[pack].count + 1;
                dicPackageIAP[pack].total =
                  dicPackageIAP[pack].total + item.price;
              } else {
                dicPackageIAP[pack] = { count: 1, total: item.price };
              }

              totalIAP += item.price;
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
        this.setState({
          ccu: dashboarResult.CCU,
          dau: dashboarResult.DAU,
          nru: dashboarResult.NRU,
          pu: dashboarResult.PU,
          totalIAP: totalIAP,
          lsCountryIAP: lsCountry,
          lsPackageIAP: lsPackage,
        });
      });

      axios
      .post(config.base_url + config.url_winRate, {
        startStage: 0,
        endStage:500,
      })
      .then(function(response) {
        console.log('__________________________',response);
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
         lsWinrate:lsRate.map(item=>{
           item.name = 'Stage_'+ item.Level;
           if(item.total > 0)
            item.rate = Math.round((item.Win / item.Total) * 100 ) ;
            else
            item.rate = 0;
          return item;
        })
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

  render() {
    const { t, cryptoTable, rtl, theme } = this.props;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <h3 className="page-title">{t('dashboard_crypto.page_title')}</h3>
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
            lsCountryIAP={
              this.state.lsCountryIAP ? this.state.lsCountryIAP : []
            }
          />
          <TradeHistory
            title="IAP by Country"
            lsCountryIAP={this.state.lsCountryIAP}
          />
          <TradeHistory
            title="IAP by Package"
            lsCountryIAP={this.state.lsPackageIAP}
          />
          <BtcEth dir={rtl.direction} data={this.state.lsWinrate} theme={theme.className} />

          <TopTen
            cryptoTable={cryptoTable}
            onDeleteCryptoTableData={this.onDeleteCryptoTableData}
          />
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
