import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import EyeIcon from 'mdi-react/EyeIcon';


class GiftCodeForm extends PureComponent {
  // static propTypes = {
  //   t: PropTypes.func.isRequired,
  //   handleSubmit: PropTypes.func.isRequired,
  //   reset: PropTypes.func.isRequired,
  // };

  constructor(props) {
    super(props);
    this.OnSubmitCLick = this.OnSubmitCLick.bind(this);
    this.state = {
      showPassword: false,
      GiftCode:'',
    };
  }

  componentDidMount(){
    this.setState({
      GiftCode:this.randomStringGiftcode(8)
    });
}

  showPassword = e => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };


  OnRefreshGiftCode = e => {
    e.preventDefault();
    this.setState({GiftCode:this.randomStringGiftcode(8)});
  };

  OnSubmitCLick(values) {
    // handle data after pass validate
    window.alert(`You submitted Local :\n\n${JSON.stringify(values, null, 2)}`);
  }

  randomStringGiftcode(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var strRan = '';
    for (var x = 0; x < length; x++) {
      var i = Math.floor(Math.random() * chars.length);
      strRan += chars.charAt(i);
    }
    console.log(strRan);
    //this.setState({GiftCode:strRan})
    return strRan;
  }


  render() {
    const { handleSubmit, reset, t } = this.props;
    const { showPassword,GiftCode } = this.state;

    return (
      <Col xs={12} md={12} lg={12} xl={6}>
        <Card>
          <CardBody>
            <div className="card__title">
              {/* <h5 className="bold-text">{t('forms.form_layouts.vertical_form')}</h5> */}
              <h5 className="bold-text">Tạo Giftcode</h5>
              <h5 className="subhead">Copy UserID Here</h5>
            </div>
            <form className="form" onSubmit={handleSubmit}>
            {/* <Col xs={6} md={6} lg={6} xl={6}>
              <div className="form__form-group">
                <span className="form__form-group-label">GiftCode</span>
                <div className="form__form-group-field">

                  <Field
                    name="GiftCode"
                    component="input"
                    type="text"
                    placeholder="giftcode"
                    values={this.state.GiftCode}
                    readOnly = "true"
                  />
                  <button
                    type="button"
                    className={`form__form-group-button${
                      showPassword ? ' active' : ''
                    }`}
                    onClick={e => this.OnRefreshGiftCode(e)}
                  >
                    <EyeIcon />
                  </button>
                </div>
              </div>
              </Col>
              */}
              <Col xs={6} md={6} lg={6} xl={6}>
              <div className="form__form-group">
                <span className="form__form-group-label">Số lượng</span>
                <div className="form__form-group-field">
                  <Field
                    name="Amount"
                    component="input"
                    type="text"
                    
                    placeholder="1"
                  />
                </div>
              </div>
              </Col>
              
              <Col xs={12} md={12} lg={12} xl={12}>
              <div className="form__form-group">
                <span className="form__form-group-label">Description (Nhập tên các phần thưởng vào đây sau này tìm cho dễ) </span>
                <div className="form__form-group-field">
                  <Field
                    name="Desc"
                    component="input"
                    type="text"
                    placeholder="Desc"
                  />
                </div>
              </div>
              </Col>
              
              <div className="form__form-group">
                <span className="form__form-group-label">Phần thưởng (Nhập đúng định dạng)</span>
                <div className="form__form-group-field">
                  <Field
                    name="Rewards"
                    component="input"
                    type="text"
                    placeholder="định dạng: id1,amount;id2,amount"
                  />
                </div>
              </div>

              <ButtonToolbar className="form__button-toolbar">
                <Button color="primary" type="submit">
                  Submit
                </Button>
                {/* <Button
                  type="button"
                  color="primary"
                  onClick={e => this.showPassword(e)}
                >
                  View
                </Button> */}
                <Button type="button" onClick={reset}>
                  Cancel
                </Button>
              </ButtonToolbar>
            </form>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default reduxForm({
  form: 'vertical_form_layout', // a unique identifier for this form
})(withTranslation('common')(GiftCodeForm));
