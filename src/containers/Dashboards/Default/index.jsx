
import React, { PureComponent } from 'react';
import { Col, Container, Row } from 'reactstrap';

import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Visits from './components/Visits';
import TotalPageViews from './components/TotalPageViews';
import NewUsers from './components/NewUsers';
import BounceRate from './components/BounceRate';
import ABTestingAnalytics from './components/ABTestingAnalytics';
import GoldRetension from './components/GoldRetension';
import GemRetension from './components/GemRetension';
import ReturnCount from './components/ReturnCount';
import SalesStatistic from './components/SalesStatistic';
import VisitorsSessions from './components/VisitorsSessions';
import BounceRateArea from './components/BounceRateArea';
import AudienceByCountry from './components/AudienceByCountry';
import BudgetStatistic from './components/BudgetStatistic';
import BestSellingRegions from './components/BestSellingRegions';
import GoalsCompletion from './components/GoalsCompletion';
import { ThemeProps, RTLProps } from '../../../shared/prop-types/ReducerProps';
import config from '../../../config/appConfig';
import axios from 'axios';

class GameDesignDashboard extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    rtl: RTLProps.isRequired,
    theme: ThemeProps.isRequired,
  };

  constructor() {
    super();
    this.state = {
      lsGoldData: [{name:"Stage_1",rate:0}],
      lsGemData: [{name:"Stage_1",rate:0}],
      lsReturnData: [{name:"Stage_1",rate:0}],
    };
  }



  componentDidMount() {

    var lsGoldRate = [];
    var lsGemRate = [];
    var lsReturn = [];




        axios
        .post(config.base_url + config.url_gem_gold_rate, {
          startStage: 0,
          endStage:501,
        })
        .then(function(response) {
          if (response.status === 200) {
            let data = response.data;
            console.log('data', data);
            if (data.status === 'ok') {
              lsGoldRate = data.data.GoldRateData;
              lsGemRate = data.data.GemRateData;
              lsReturn = data.data.ReturnData;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(() => {
          this.setState({
           lsGemData:lsGemRate,
           lsGoldData:lsGoldRate,
           lsReturnData:lsReturn,
          });
        });

  }
  render() {

    const { t, rtl, theme } = this.props;

    var chartGold;
    if(this.state.lsGoldData.length > 1) 
      chartGold = <GoldRetension dir={rtl.direction} data={this.state.lsGoldData}  callback={this.onStageCallback} /> 
    
    var chartGem;
    if(this.state.lsGemData.length > 1) 
      chartGem = <GemRetension dir={rtl.direction} data={this.state.lsGemData}  callback={this.onStageCallback} /> 
     
    var chartReturn;
    if(this.state.lsReturnData.length > 1) 
      chartReturn = <ReturnCount dir={rtl.direction} data={this.state.lsReturnData}  callback={this.onStageCallback} /> 
          


    return (
      <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Game Design Dashboard</h3>
        </Col>
      </Row>
      {/* <Row>
        <Visits />
        <TotalPageViews />
        <NewUsers />
        <BounceRate />
      </Row> */}
      <Row>
        {/* <ABTestingAnalytics dir={rtl.direction} /> */}
        {/* theme={theme.className} */}
        {chartGold}
        {chartGem}
        {chartReturn}
        {/* <GoldRetension dir={rtl.direction} data={this.state.lsGoldData}  callback={this.onStageCallback} /> 
        <GemRetension dir={rtl.direction} data={this.state.lsGemData} callback={this.onStageCallback} />
        <ReturnCount dir={rtl.direction} data={this.state.lsReturnData} callback={this.onStageCallback} /> */}
        
        {/* <BounceRateArea dir={rtl.direction} />
        <VisitorsSessions dir={rtl.direction} />
        <SalesStatistic />
        <BudgetStatistic />
        <AudienceByCountry />
        <BestSellingRegions />
        <GoalsCompletion /> */}
      </Row>
    </Container>
  
    )

  }


}





// export default compose(withTranslation('common'), connect(state => ({
//   rtl: state.rtl,
// })))(DefaultDashboard);
export default connect((state) => ({
  cryptoTable: state.cryptoTable.items,
  rtl: state.rtl,
  theme: state.theme,
}))(withTranslation('common')(GameDesignDashboard));
