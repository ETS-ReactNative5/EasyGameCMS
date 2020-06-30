/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Button, Card, CardBody, Col, Row ,  Container,Label} from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MagnifyIcon from 'mdi-react/MagnifyIcon';
import EditTable from '../../../../shared/components/table/EditableTable';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import CellphoneKeyIcon from 'mdi-react/CellphoneKeyIcon';
import DiamondStoneIcon from 'mdi-react/DiamondStoneIcon';
import CommentAlertOutlineIcon from 'mdi-react/CommentAlertOutlineIcon';
import CloseCircleOutlineIcon from 'mdi-react/CloseCircleOutlineIcon';
import ThumbUpOutlineIcon from 'mdi-react/ThumbUpOutlineIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import { Field, reduxForm,formValues  } from 'redux-form';
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import config from '../../../../config/appConfig';

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
  value === 'Online' ? (
    <span className="badge badge-success">Online</span>
  ) : (
    <span className="badge badge-disabled">Offline</span>
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
        name: 'id',
        width: 80,
        sortable: true,
      },
      {
        key: 'UserCode',
        name: 'UserCode',
        formatter: PhotoFormatter,
      },
      {
        key: 'DisplayName',
        name: 'DisplayName',
        sortable: true,
      },
      {
        key: 'MaxStage',
        name: 'MaxStage',
        sortable: true,
      },
      {
        key: 'quantity',
        name: 'Gem',
        sortable: true,
      },
      {
        key: 'articul',
        name: 'Gold',
        sortable: true,
      },
      {
        key: 'price',
        name: 'Stone',
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
      rows: [],//this.createRows(17),
      pageOfItems: [],
      UserId:"",
      DisplayName:"",
      UserCode:"",
      DeviceId:""

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
    const rows = [];

    for (let i = 1; i < numberOfRows + 1; i += 1) {
      rows.push({
        id: Math.min(99999, Math.round(Math.random() * 99999 + 1000)),
        photo: [Img1, Img2, Img3, Img4, Img5, Img6, Img7][
          Math.floor(Math.random() * 7)
        ],
        name: ['Glass Vase', 'Pillow'][Math.floor(Math.random() * 2)],
        category: ['VN', 'US'][Math.floor(Math.random() * 2)],
        quantity: Math.min(400, Math.round(Math.random() * 400)),
        articul: `${Math.min(99999, Math.round(Math.random() * 99999 + 1))}`,
        price: Math.min(1000, Math.random() * 1000 + 20).toFixed(2),
        status: ['Online', 'Offline'][Math.floor(Math.random() * 2)],
      });
    }
    return rows;
  };


  OnSearchClick = e => {
    e.preventDefault();
  console.log("UserId ",this.state.UserId);
  console.log("DisplayName ",this.state.DisplayName);
  console.log("UserCode ",this.state.UserCode);
  console.log("DeviceId ",this.state.DeviceId);

var userList = [];

  axios.post(config.base_url + config.url_FindUser, {
    UserId: this.state.UserId,
    DisplayName:this.state.DisplayName,
    UserCode:this.state.UserCode,
    DeviceId:this.state.DeviceId,
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
    console.log(userList);
    this.setState({
      rows:userList,
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

  render() {
    //const { rows } = this.state;

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
                <Row >
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
            
                </Row>
              
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
            <EditTable heads={this.heads} rows={this.state.rows} enableRowSelect />
          </CardBody>
        </Card>
     </Row>
     
      </Col>
  
    );
  }
}


export default reduxForm({
  form: 'user-search-form', // a unique identifier for this form
})(withTranslation('common')(ProductsListTable));
