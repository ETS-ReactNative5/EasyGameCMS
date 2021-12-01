import React, { PureComponent } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import {
  AreaChart, Tooltip, Area, ResponsiveContainer, XAxis,
} from 'recharts';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import PropTypes from 'prop-types';
import config from '../../../../config/appConfig';
import axios from 'axios';


var data = [{ name: '6DaysAgo', NRU: 0 },
  { name: '5DaysAgo', NRU: 0 },
  { name: '4DaysAgo', NRU: 0 },
  { name: '3DaysAgo', NRU: 0 },
  { name: '2DaysAgo', NRU: 0 },
  { name: 'YesterDay', NRU: 0 },
  { name: 'Now', NRU: 0 }];

const CustomTooltip = ({ active, payload }) => {
  if (active) {
    return (
      <div className="dashboard__total-tooltip">
        <p className="label">{`$${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
  })),
};

CustomTooltip.defaultProps = {
  active: false,
  payload: null,
};

export default class NRU extends PureComponent {
  static propTypes = {
    dir: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      activeIndex: 0,
    };
  }
  componentDidMount() {
    axios
    .post(config.test_url + config.url_gameStats, {
      userID: sessionStorage.getItem('userID'),
    })
    .then(function(response) {
      if (response.status === 200) {
        let result = response.data;
        if (result.status === 'ok') {
          let NruResult = result.data.NRU;
          for(let i = 0; i < NruResult.length; i++) {
            data[i].NRU = NruResult[i];
          }
        }
      }})
    .catch(err => console.log(err))
  };


  render() {
    const { dir } = this.props;
    const { activeIndex } = this.state;
    const activeItem = data[activeIndex];

    return (
      <Col md={12} xl={3} lg={6} xs={12}>
        <Card>
          <CardBody className="dashboard__card-widget">
            <div className="card__title">
              <h4 className="bold-text">NRU</h4>
              <h5 className="subhead">Week</h5>
            </div>
            <div className="dashboard__total dashboard__total--area">
              <TrendingUpIcon className="dashboard__trend-icon" />
              <p className="dashboard__total-stat">
                {this.props.nru}
              </p>
              <div className="dashboard__chart-container">
                <ResponsiveContainer height={70}>
                  <AreaChart data={data} margin={{ top: 0, left: 0, bottom: 0 }}>
                    <Tooltip content={<CustomTooltip />} />
                    <XAxis
                      hide
                      reversed={dir === 'rtl'}
                    />
                    <Area
                      name="NRU"
                      type="monotone"
                      dataKey="NRU"
                      fill="#6faae1"
                      stroke="#6faae1"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
