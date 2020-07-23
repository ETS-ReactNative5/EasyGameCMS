/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Button, Card, CardBody, Col, Row ,  Container,Table,} from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MagnifyIcon from 'mdi-react/MagnifyIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import CellphoneKeyIcon from 'mdi-react/CellphoneKeyIcon';
import DiamondStoneIcon from 'mdi-react/DiamondStoneIcon';
import CommentAlertOutlineIcon from 'mdi-react/CommentAlertOutlineIcon';
import CloseCircleOutlineIcon from 'mdi-react/CloseCircleOutlineIcon';
import ReactDataGrid from 'react-data-grid';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import { Field, reduxForm,formValues  } from 'redux-form';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import config from '../../../../config/appConfig';

import Panel from '../../../../shared/components/Panel';

const Img1 = `${process.env.PUBLIC_URL}/img/for_store/vase.png`;
const Img2 = `${process.env.PUBLIC_URL}/img/for_store/vase_2.png`;
const Img3 = `${process.env.PUBLIC_URL}/img/for_store/vase_3.png`;
const Img4 = `${process.env.PUBLIC_URL}/img/for_store/fur.png`;
const Img5 = `${process.env.PUBLIC_URL}/img/for_store/pillow.png`;
const Img6 = `${process.env.PUBLIC_URL}/img/for_store/pillow_2.png`;
const Img7 = `${process.env.PUBLIC_URL}/img/for_store/pillow_dog.png`;

const PhotoFormatter = ({ value }) => (
  <div className="products-list__img-wrap">
    <img src={value} alt="" />
  </div>
);

PhotoFormatter.propTypes = {
  value: PropTypes.string.isRequired,
};

const StatusFormatter = ({ value }) =>
  value === 'Active' ? (
    <span className="badge badge-success">Active</span>
  ) : (
    <span className="badge badge-danger">Baned</span>
  );

StatusFormatter.propTypes = {
  value: PropTypes.string.isRequired,
};

class ProductsListTable extends PureComponent {
  constructor() {
    super();
    this.heads = [
      {
        key: '_id',
        name: '_id',
        width: 200,
        sortable: true,
      },
      {
        key: 'UserCode',
        name: 'UserCode',
        width: 100,
        sortable: true,
      },
      {
        key: 'DisplayName',
        name: 'DisplayName',
        sortable: true,
      },
      {
        key: 'MaxStage',
        name: 'MaxStage',
        width: 80,
        sortable: true,
      },
      {
        key: 'Gem',
        name: 'Gem',
        width: 100,
        sortable: true,
      },
      {
        key: 'Coin',
        name: 'Coin',
        width: 100,
        sortable: true,
      },
      {
        key: 'Stone',
        name: 'Stone',
        width: 100,
        sortable: true,
      },
      {
        key: 'status',
        name: 'Status',
        sortable: true,
        formatter: StatusFormatter,
        width: 110,
      },
    ];

    this.state = {
      rows:[],// this.createRows(15),
      pageOfItems: [],
      UserId:"",
      DisplayName:"",
      UserCode:"",
      DeviceId:"",
      selectedIndexes: [],
    };
  }

   onChangeValue = e =>{
    var data = {}
    data[e.target.name] = e.target.value;
    this.setState(data);
  }

  onChangePage = pageOfItems => {
    // update state with new page of items
    this.setState({ pageOfItems });
  };

  getRandomDate = (start, end) =>
    new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toLocaleDateString();

  createRows = numberOfRows => {
    var rows = [];

    for (let i = 1; i < numberOfRows + 1; i += 1) {
      rows.push({
        _id: Math.min(99999, Math.round(Math.random() * 99999 + 1000)),
        UserCode: [Img1, Img2, Img3, Img4, Img5, Img6, Img7][
          Math.floor(Math.random() * 7)
        ],
        DisplayName: ['Glass Vase', 'Pillow'][Math.floor(Math.random() * 2)],
        MaxStage: ['VN', 'US'][Math.floor(Math.random() * 2)],
        quantity: Math.min(400, Math.round(Math.random() * 400)),
        articul: `${Math.min(99999, Math.round(Math.random() * 99999 + 1))}`,
        price: Math.min(1000, Math.random() * 1000 + 20).toFixed(2),
        status: ['Online', 'Offline'][Math.floor(Math.random() * 2)],
      });
    }
    return rows;
  };

  onRowsSelected = rows => {
    console.log(rows);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.concat(
        rows.map(r => r.rowIdx)
      )
    });
  };

  onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(
        i => rowIndexes.indexOf(i) === -1
      )
    });
  };

  OnSearchClick = e => {
    e.preventDefault();
  console.log("UserId ",this.state.UserId);
  console.log("DisplayName ",this.state.DisplayName);
  console.log("UserCode ",this.state.UserCode);
  console.log("DeviceId ",this.state.DeviceId);

var userList = [];

  axios.post(config.base_url + config.url_FindUser, {
    UserId: this.state.UserId.trim(),
    DisplayName:this.state.DisplayName.trim(),
    UserCode:this.state.UserCode.trim(),
    DeviceId:this.state.DeviceId.trim(),
    Coin:this.state.Coin,
    Gem:this.state.Gem,
    Level:this.state.Level,
  })
  .then(function(response) {
    console.log(response);
    if (response.status === 200) {
      let data = response.data;
      console.log('data', data);
      if (data.status === 'ok') {
        userList = data.data;
      }
    }
  })
  .catch(function(error) {
    console.log(error);
  })
  .then(() => {
   
    this.setState({
      rows:userList,
    },()=>{
      console.log(this.state.rows);
    })
  });

};

  OnClearClick = e => {
    e.preventDefault();

  this.setState({
  UserId:'',
  DisplayName:'',
  UserCode:'',
  DeviceId:'',

  });


  };


  handleSubmit = e => {
    const uName = formValues("username");
    console.log("click search " + uName);
  };

  rowGetter = (i) => {
    const { rows } = this.state;
    return rows[i];
  };

  render() {
    const { rows } = this.state;

    return (
      <Col md={12} lg={12}>
        <Row>
        <Card>
          <CardBody>
          <div className="card__title">
              <h5 className="bold-text">Search User</h5>
              </div>
                <form className="form" >
                <Container>
                <Row>
                <Col md={6} xl={3}>
                   <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <KeyVariantIcon />
                  </div>
                  <input name="UserId" 
                  value = {this.state.UserId}
                   placeholder="_id" 
                   onChange={this.onChangeValue} />
                </div>
                </Col>
                <Col md={6} xl={3}>
                   <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <AccountOutlineIcon />
                  </div>
                  <input
                    name="DisplayName"
                    value = {this.state.DisplayName}
                    placeholder="DisplayName"
                    onChange={this.onChangeValue}
                  />
                </div>
                </Col>
                <Col md={6} xl={3}>
                   <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <AccountOutlineIcon />
                  </div>
                  <input
                    name="UserCode"
                    value = {this.state.UserCode}
                    onChange={this.onChangeValue}
                    placeholder="UserCode"
                  />
                </div>
                </Col>
                <Col md={6} xl={3}>
                   <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <CellphoneKeyIcon />
                  </div>
                  <input
                    name="DeviceId"
                    value = {this.state.DeviceId}
                    onChange={this.onChangeValue}
                    placeholder="DeviceId"
                  />
                </div>
                </Col>
                </Row>
               {/* <Row> <Label for="exampleEmail" sm={2}>Advance</Label></Row> */}
                {/* <Row >
                  <Col md={4} xl={4} className="form--horizontal">
                  <div className="form__form-group">
                <span className="form__form-group-label"></span>
                <div className="form__form-group-field">
                <Label for="exampleEmail" sm={2}>Gem</Label>
                <select className="select-options">
                <option value="1">Lớn hơn</option>
                <option value="-1">Nhỏ hơn</option>
                <option value="0">Bằng</option>
              </select>
                  <div className="form__form-group-icon">
                    <DiamondStoneIcon />
                  </div>
                  <Field
                    name="gem"
                    component="input"
                    type="text"
                    placeholder="Gem"
                  />
                </div>
              </div> </Col>
              <Col md={4} xl={4} className="form--horizontal">
                  <div className="form__form-group">
                <span className="form__form-group-label"></span>
                <div className="form__form-group-field">
                <Label for="exampleEmail" sm={2}>Coin</Label>
                <select className="select-options">
                <option value="1">Lớn hơn</option>
                <option value="-1">Nhỏ hơn</option>
                <option value="0">Bằng</option>
              </select>
                  <div className="form__form-group-icon">
                    <DiamondStoneIcon />
                  </div>
                  <Field
                    name="coin"
                    component="input"
                    type="text"
                    placeholder="Coin"
                  />
                </div>
              </div> </Col>
              <Col md={4} xl={4} className="form--horizontal">
                  <div className="form__form-group">
                <span className="form__form-group-label"></span>
                <div className="form__form-group-field">
                <Label for="exampleEmail" sm={2}>Dragon</Label>
                <select className="select-options">
                <option value="1">Lớn hơn</option>
                <option value="-1">Nhỏ hơn</option>
                <option value="0">Bằng</option>
              </select>
                  <div className="form__form-group-icon">
                    <DiamondStoneIcon />
                  </div>
                  <Field
                    name="level"
                    component="input"
                    type="text"
                    placeholder="DragonLevel"
                  />
                </div>
              </div> </Col>

                </Row>*/}
                <div className="card__title"/>
                </Container> 
                <Button className="icon" color="success" onClick={e => this.OnSearchClick(e)}><p> <MagnifyIcon /> Search</p></Button>
                <Button className="icon" color="warning" onClick={e => this.OnClearClick(e)}><p><CloseCircleOutlineIcon /> Clear</p></Button>
                </form>
          </CardBody>
        </Card>
        </Row>
        <Row>  <Card>
          <CardBody className="products-list">
            <div className="card__title">
              <h5 className="bold-text">User List</h5>
               </div>
            <p className="typography-message">
              Show
              <select className="select-options">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
              entries
            </p>
            <div className="table">
        <ReactDataGrid
          // onGridSort={this.handleGridSort}
          rowKey="_id"
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes
            }
          }}
          columns={this.heads}
          rowGetter={this.rowGetter}
          rowsCount={rows.length}
          rowHeight={44}
          minColumnWidth={100}
        />
      </div>
            {/* <EditTable heads={this.heads} rows={this.state.rows} enableRowSelect /> */}
          </CardBody>
        </Card>
     </Row>
     
     <Panel lg={12} title="List User">
    <Table responsive className="table--bordered dashboard__table-crypto">
      <thead>
        <tr>
          <th>#</th>
          <th>_id</th>
          <th>UserCode</th>
          <th>DisplayName</th>
          <th>MaxStage</th>
          <th>Gem</th>
          <th>Coin</th>
          <th>Stone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((crypto, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
           
            <td dir="ltr">{crypto._id}</td>
            <td dir="ltr">{crypto.UserCode}</td>
            <td dir="ltr">{crypto.DisplayName}</td>
            <td dir="ltr">{crypto.MaxStage}</td>
            <td>{crypto.Gem}</td>
            <td>{crypto.Coin}</td>
            <td>{crypto.Stone}</td>
            {/* <td className="dashboard__table-crypto-chart">
              <ResponsiveContainer height={36}>
                <AreaChart data={data} margin={{ top: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={crypto.chart}
                    fill="#4ce1b6"
                    stroke="#4ce1b6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </td> */}
            {/* <td>
              <DropDownMore index={index} handleDeleteRow={e => onDeleteCryptoTableData(index, e)} />
            </td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  </Panel>


      </Col>
  
    );
  }
}


export default reduxForm({
  form: 'user-search-form', // a unique identifier for this form
})(withTranslation('common')(ProductsListTable));
