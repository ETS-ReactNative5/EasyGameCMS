import React, { PureComponent } from 'react';
import { Col, Container, Row, Button } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BossScoreView from './components/BossScoreView';

//import PlaceOrder from './components/PlaceOrder';
import { deleteCryptoTableData } from '../../../redux/actions/cryptoTableActions';
import { CryptoTableProps } from '../../../shared/prop-types/TablesProps';
import { ThemeProps, RTLProps } from '../../../shared/prop-types/ReducerProps';
import config from '../../../config/appConfig';
import axios from 'axios';
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
      levelBoss: 0,
      listSurvival: [],
      listBossScore: [],
    };
  }

  componentDidMount() {
    this.getBossScore();
  }

  getBossScore = async() => {
    let lsSurvival = [];
    await  
        axios
        .post(config.base_url + config.url_getBossScore, {
          userID: sessionStorage.getItem('userID'),
          BossScore: this.state.levelBoss,
        })
        .then(function(response) {
          console.log(response);
          if (response.status === 200) {
            let data = response.data;
            if (data.status === 'ok') {
              lsSurvival = data.data;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(() => {
          this.setState({
            listSurvival: lsSurvival.map((item) => {
              let user = {};
              user.UserId = item.UserId;
              user.DisplayName = item.PlayerData.DisplayName;
              user.Country = item.PlayerData.Country;
              user.Score = item.Score;
              return user;
            }),
            //lsPackageIAP: lsPackage,
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

  inCreaseLevelBoss = async() => {
    this.setState({levelBoss: this.state.levelBoss +1 }, () => {
    //  console.log(this.state.levelBoss)
      this.getBossScore()
    })
  }

  deCreaseLevelBoss = async() => {
    if(this.state.levelBoss) {
    this.setState({levelBoss: this.state.levelBoss -1 }, () => {
     // console.log(this.state.levelBoss)
      this.getBossScore()
    })
  }
  }
  render() {
    const { t, cryptoTable, rtl, theme } = this.props;
    const levelBoss = 'Level: ' + this.state.levelBoss
    // var chartStage;
    // if (this.state.lsWinrate.length > 1)
    //   chartStage = <BtcEth data={this.state.lsWinrate} theme={theme.className} callback={this.onStageCallback} />;

    return (
      <Container className='dashboard'>
        <Row>
          <Col md={12}>
            <h3 className='page-title'>Jackal Leaderboard</h3>
            <Container style={{ textAlign: 'center' }}>
                <Button className='inlineBtn' 
                        onClick={() => this.deCreaseLevelBoss()}>
                  <p> Previous</p>
                </Button>
                <h4 
                    style={{ display: 'inline-block', fontWeight: 'bold' }}> 
                    {levelBoss} 
                </h4>
                <Button className='inlineBtn' onClick={() => this.inCreaseLevelBoss()}>
                  <p>
                    {'    '}
                    Next
                  </p>
                </Button>
              </Container>
          </Col>
        </Row>

        <Row>
          <BossScoreView title='Boss Score' lsCountryIAP={this.state.listSurvival} />
          {/* <LeaderboardView title='BossScore' lsCountryIAP={this.state.lsPackageIAP} /> */}
          {/* {chartStage} */}
          
          {/* <TopTen cryptoTable={cryptoTable} onDeleteCryptoTableData={this.onDeleteCryptoTableData} /> */}
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
