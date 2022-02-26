import React, { PureComponent } from 'react';
import {
  Container, Card, CardBody, Col, Button, ButtonToolbar, Row
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TimetableIcon from 'mdi-react/TimetableIcon';
import renderSelectField from '../../../shared/components/form/Select';
import renderDateTimePickerField from '../../../shared/components/form/DateTimePicker';
import validate from '../../Form/FormValidation/components/validate';
import axios from 'axios';
import Expand from './../../../shared/components/Expand';
import config from '../../../config/appConfig';


const renderField = ({
  input, placeholder, type, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    <input {...input} placeholder={placeholder} type={type} />
    {touched && error && <span className="form__form-group-error">{error}</span>}
  </div>
);

renderField.propTypes = {
  input: PropTypes.shape().isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

renderField.defaultProps = {
  placeholder: '',
  meta: null,
  type: 'text',
};

class MailSystem extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.state = {
      mailId: '',
      language: '',
      title: '',
      sender: '',
      bannerUrl: '',
      link: '',
      content: '',
      gifts: '',
      startDate: '',
      expirationDate: '',
      appVersion: 0,
      minVersion: 0,
      relativeVersion: 0,
      isActiveAdd: false,
      isActiveUpdate: false,
      isActiveVerison: false,
    };
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
    });
  }

  handleSenderChange(event) {
    this.setState({
      sender: event.value,
    });
  }

  handleBannerUrlChange(event) {
    this.setState({
      bannerUrl: event.target.value,
    });
  }

  handleLinkChange(event) {
    this.setState({
      link: event.target.value,
    });
  }

  handleContentChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleGiftChange(event) {
    this.setState({
      gifts: event.target.value,
    });
  }

  handleStartDateChange(event) {
    this.setState({
      startDate: event,
    });
  }

  handleExpirationDateChange(event) {
    this.setState({
      expirationDate: event.target.value,
    });
  }

  handleAppVersionChange(event) {
    console.log(event.target.value)
    this.setState({
      appVersion: event.target.value,
    });
  }

  handleMinVersionChange(event) {
    this.setState({
      minVersion: event.target.value,
    });
  }

  handleMaxVersionChange(event) {
    this.setState({
      relativeVersion: event.target.value,
    });
  }

  handleIdChange(event) {
    this.setState({
      mailId: event.target.value,
    });
  }

  handleLanguageChange(event) {
    this.setState({
      language: event.value,
    });
  }

  onSubmitClick = (e) => {
    var msg = '';
    e.preventDefault();
      axios
        .post(config.test_mail + config.url_addMail, {
          adminMail: sessionStorage.getItem('userID'),
          passWord: sessionStorage.getItem('passWord'),
          title: this.state.title,
          sender: this.state.sender,
          bannerUrl: this.state.bannerUrl,
          link: this.state.link,
          content: this.state.content,
          gifts: this.state.gifts,
          startDate: this.state.startDate,
          dayPushMail: this.state.expirationDate,
          appVersion: this.state.appVersion,
          minVersion: this.state.minVersion,
          maxVersion: this.state.relativeVersion,
          isSystemMail: true,
        })
        .then(function(response) {
          console.log(response.data.Body);
          if (response.data.Status === 1) {
            msg = 'Add Mail Success';
          } else {
            msg = `Add Mail Err: ${response.data.Body.Err}`
          }

        })
        .then(() => {
          window.alert(msg);
        });
  };

  onUpdateClick = (e) => {
    var msg = '';
    e.preventDefault();
      axios
        .post(config.test_mail + config.url_updateMail, {
          adminMail: sessionStorage.getItem('userID'),
          passWord: sessionStorage.getItem('passWord'),
          mailId: this.state.mailId,
          language: this.state.language,
          title: this.state.title,
          sender: this.state.sender,
          bannerUrl: this.state.bannerUrl,
          link: this.state.link,
          content: this.state.content,
          gifts: this.state.gifts,
          isSystemMail: true,
        })
        .then(function(response) {
          console.log(response.data.Body);
          if (response.data.Status === 1) {
            msg = 'Update Mail Success';
          } else {
            msg = `Update Mail Err: ${response.data.Body.Err}`
          }

        })
        .then(() => {
          window.alert(msg);
        });
  };

  render() {
    const {
       pristine, reset, submitting,
    } = this.props;

    const LanguageOptions = [
      { value: 'English', label: 'English' },
      { value: 'Vietnamese', label: 'Vietnamese' },
      { value: 'Russian', label: 'Russian' },
      { value: 'Spanish', label: 'Spanish' },
      { value: 'French', label: 'French' },
      { value: 'Japanese', label: 'Japanese' },
      { value: 'Korean', label: 'Korean' },
      { value: 'Thai', label: 'Thai' },
      { value: 'Arabic', label: 'Arabic' },
      { value: 'Chinese', label: 'Chinese' },
      { value: 'Portuguese', label: 'Portuguese' },
      { value: 'German', label: 'German' },
      { value: 'Italian', label: 'Italian' },
      { value: 'Indonesian', label: 'Indonesian' },
      { value: 'Turkish', label: 'Turkish' },
    ];
    return (
      <Col md={12} lg={12} xl={12}>
        <Row>
          <Card>
            <CardBody className="products-list">
            <div className="card__title">
              <h5 className="bold-text">List Mail System</h5>
              <div style={{float: 'right'}}>
                <Expand 
                    title="Add"  
                    color="success"
                    handleClick={() => {this.setState({isActiveAdd: true, isActiveUpdate: false});
                }}/>           
                <Expand
                    title="Update"
                    color="primary"
                    handleClick={() => {this.setState({isActiveAdd: false, isActiveUpdate: true});
                  }}/>  
              </div>
              
            </div>
            </CardBody>        
          </Card>
        </Row>
        {this.state.isActiveAdd ?  
        <Row>
          <Card>
            <CardBody>
            <div className="card__title">
                <h5 className="bold-text">Mail System</h5>
                <h3 className="page-subhead subhead">
                    New Mail Use Default English Language 
                </h3>
            </div>
              <form className="form form--horizontal" onSubmit={this.onSubmitClick}>

              <div className="form__form-group">
                  <span className="form__form-group-label">Title</span>
                  <div className="form__form-group-field">
                    <Field
                      name="title"
                      component={renderField}
                      type="text"
                      value={this.state.title}
                      onChange={this.handleTitleChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Sender</span>
                  <div className="form__form-group-field">
                    <Field
                      name="sender"
                      component={renderSelectField}
                      options={[
                        { value: 'Jackal Squat Team', label: 'Jackal Squat Team' },
                      ]}
                      value={this.state.sender}
                      onChange={this.handleSenderChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Banner Url</span>
                  <div className="form__form-group-field">
                  <Field
                      name="bannerurl"
                      component={renderField}
                      type="bannerurl"
                      value={this.state.bannerUrl}
                      onChange={this.handleBannerUrlChange.bind(this)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Link</span>
                  <div className="form__form-group-field">
                    <Field
                      name="link"
                      component={renderField}
                      type="text"
                      defaultValue="https://www.facebook.com/jackalsquad"
                      value={this.state.link}
                      onChange={this.handleLinkChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Content</span>
                  <div className="form__form-group-field">
                    <Field
                      name="content"
                      component={renderField}
                      component="textarea"
                      type="text"
                      value={this.state.content}
                      onChange={this.handleContentChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Gifts</span>
                  <div className="form__form-group-field">
                    <Field
                      name="gifts"
                      component="input"
                      type="text"
                      placeholder="Optional: tạm thời sẽ nhập phần quà định dạng json, sẽ thay đổi sau này"
                      value={this.state.gifts}
                      onChange={this.handleGiftChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Start Date</span>
                  <div className="form__form-group-field">
                    <Field
                      name="startdate"
                      component={renderDateTimePickerField}
                      value={this.state.startDate}
                      onChange={this.handleStartDateChange.bind(this)}
                    />
                    <div className="form__form-group-icon">
                      <TimetableIcon />
                    </div>
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Expiration Date</span>
                  <div className="form__form-group-field">
                    <Field
                      name="enddate"
                      component={renderField}
                      type="text"
                      placeholder="Enter day number to end date of mails"
                      value={this.state.expirationDate}
                      onChange={this.handleExpirationDateChange.bind(this)}
                    />
                  </div>
                </div>
                <Container>
                <Row>
                <Col md={6} xl={4}>
                <div  className="form__form-group">
                  <span className="form__form-group-label">App Version</span>
                  <div className="form__form-group-field">
                    <Field
                      name="appversion"
                      component={renderField}
                      type="text"
                      placeholder="Optional"
                      value={this.state.appVersion}
                      onChange={this.handleAppVersionChange.bind(this)}
                    />
                  </div>
                </div>
                </Col>
                <Col md={6} xl={4}>
                <div  className="form__form-group">
                  <span className="form__form-group-label">Min Version</span>
                  <div className="form__form-group-field">
                    <Field
                      name="minversion"
                      component={renderField}
                      type="text"
                      placeholder="Optional"
                      value={this.state.minVersion}
                      onChange={this.handleMinVersionChange.bind(this)}
                    />
                  </div>
                </div>
                </Col>
                <Col md={6} xl={4}>
                <div  className="form__form-group">
                  <span className="form__form-group-label">Relative Version</span>
                  <div className="form__form-group-field">
                    <Field
                      name="relativeversion"
                      component={renderField}
                      type="text"
                      placeholder="Optional"
                      value={this.state.relativeVersion}
                      onChange={this.handleMaxVersionChange.bind(this)}
                    />
                  </div>
                </div>
                </Col>
                  </Row>
                  </Container>
                <ButtonToolbar className="form__button-toolbar">
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                  <Button type="button" onClick={reset , () => this.setState({isActiveAdd: false})} disabled={pristine || submitting}>
                    Cancel
                  </Button>
                </ButtonToolbar>
              </form>
            </CardBody>        
          </Card>
        </Row>
        : null} 
        {this.state.isActiveUpdate ?  
        <Row>
          <Card>
            <CardBody>
            <div className="card__title">
                <h5 className="bold-text">Mail System</h5>
                <h3 className="page-subhead subhead">
                    Add Language for Mail System 
                </h3>
            </div>
              <form className="form form--horizontal" onSubmit={this.onUpdateClick}>
              <div className="form__form-group">
                  <span className="form__form-group-label">Mail Id</span>
                  <div className="form__form-group-field">
                    <Field
                      name="mailId"
                      component={renderField}
                      type="text"
                      value={this.state.title}
                      onChange={this.handleIdChange.bind(this)}
                    />
                  </div>
                </div>
              <div className="form__form-group">
                  <span className="form__form-group-label">Language</span>
                  <div className="form__form-group-field">
                    <Field
                    name="language"    
                    component={renderSelectField}
                    options={LanguageOptions}
                    value={this.state.language}
                    onChange={this.handleLanguageChange.bind(this)}
                  /> 
                  </div>
                </div>
              <div className="form__form-group">
                  <span className="form__form-group-label">Title</span>
                  <div className="form__form-group-field">
                    <Field
                      name="title"
                      component={renderField}
                      type="text"
                      value={this.state.title}
                      onChange={this.handleTitleChange.bind(this)}
                    />
                  </div>
                </div>
         
                <div className="form__form-group" >
                  <span className="form__form-group-label">Content</span>
                  <div className="form__form-group-field">
                    <Field
                      name="content"
                      component={renderField}
                      component="textarea"
                      type="text"
                      value={this.state.content}
                      onChange={this.handleContentChange.bind(this)}
                    />
                  </div>
                </div>

                <ButtonToolbar className="form__button-toolbar">
                  <Button color="primary" type="submit">
                    Update
                  </Button>
                  <Button type="button" onClick={reset , () => this.setState({isActiveUpdate: false})} disabled={pristine || submitting}>
                    Cancel
                  </Button>
                </ButtonToolbar>
              </form>
            </CardBody>        
          </Card>
        </Row>
        : null}  
      </Col>
    );
  }
}

export default reduxForm({
  form: 'horizontal_form_validation', // a unique identifier for this form
  validate,
})(withTranslation('common')(MailSystem));
