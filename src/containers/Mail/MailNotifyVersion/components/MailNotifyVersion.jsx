import React, { PureComponent } from "react";
import {
  Container,
  Card,
  CardBody,
  Col,
  Button,
  ButtonToolbar,
  Row,
  Table,
} from "reactstrap";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import TimetableIcon from "mdi-react/TimetableIcon";
import renderSelectField from "./../../../../shared/components/form/Select";
import renderDateTimePickerField from "./../../../../shared/components/form/DateTimePicker";
import validate from "./../../../Form/FormValidation/components/validate";
import axios from "axios";
import Expand from "./../../../../shared/components/Expand";
import config from "./../../../../config/appConfig";

const renderField = ({
  input,
  placeholder,
  type,
  meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    <input {...input} placeholder={placeholder} type={type} />
    {touched && error && (
      <span className="form__form-group-error">{error}</span>
    )}
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
  placeholder: "",
  meta: null,
  type: "text",
};
const StatusFormatter = (isDeleted, startDate, endDate) => {
  switch (true) {
    case isDeleted === false &&
      new Date(startDate) < new Date() &&
      new Date(endDate) > new Date():
      return <span className="badge badge-success">Active</span>;
    case isDeleted === false && new Date(startDate) > new Date():
      return <span className="badge badge-warning">Coming soon</span>;
    case isDeleted === true &&
      new Date(startDate) < new Date() &&
      new Date(endDate) > new Date():
      return <span className="badge badge-danger">Delete</span>;
    default:
      return <span className="badge badge-danger">Expried</span>;
  }
};

StatusFormatter.propTypes = {
  value: PropTypes.string.isRequired,
};

const StatusBigUpdate = (isBigUpdate) => {
  if (isBigUpdate) {
    return <span className="badge badge-warning">Yes</span>;
  } else {
    return <span className="badge badge-light">No</span>;
  }
};

StatusBigUpdate.propTypes = {
  value: PropTypes.string.isRequired,
};

class MailNotifyVersion extends PureComponent {
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
      mailId: "",
      language: "",
      title: "",
      sender: "",
      bannerUrl: "",
      link: "",
      content: "",
      gifts: "",
      startDate: "",
      endDate: "",
      appVersion: 0,
      minVersion: 0,
      relativeVersion: 0,
      mailIdActive: "",
      isActiveAdd: false,
      isActiveUpdate: false,
      addBigUpdate: false,
      updateTemplate: false,
      listMailNotifySystem: [],
      viewByLanguage: "English",
    };
  }

  componentDidMount() {
    this.getMailSystem();
  }

  getMailSystem = async () => {
    await axios
      .post(config.test_mail + config.url_getMailSystem, {
        adminMail: sessionStorage.getItem("userID"),
        passWord: sessionStorage.getItem("passWord"),
        language: this.state.viewByLanguage,
        isMailNotifyVerison: true,
      })
      .then((resposne) => {
        let listMailNotify = resposne.data.Body.data;
        this.setState({
          listMailNotifySystem: listMailNotify,
        });

        if (listMailNotify.length) {
          for (let mail of listMailNotify) {
            if (
              !mail.isDeleted &&
              new Date(mail.startDate) < new Date() &&
              new Date(mail.endDate) > new Date()
            ) {
              this.setState({ mailIdActive: mail.id });
              break;
            }
          }
          for (let mail of listMailNotify) {
            if (mail.isBigUpdate && new Date(mail.startDate) < new Date()) {
              this.setState({ relativeVersion: mail.Version });
              break;
            }
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
    });
  }

  handleSenderChange(event) {
    this.setState({
      sender: event.target.value,
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
    let giftList = event.target.value.replace(/ /g, "").split(",");
    let gift = {};
    if (giftList.length % 2 === 0) {
      for (let i = 0; i < giftList.length - 1; i += 2) {
        gift[giftList[i]] = giftList[i + 1];
      }
    }
    this.setState({
      gifts: gift,
    });
    console.log(Object.keys(this.state.gifts).length);
  }

  handleStartDateChange(event) {
    this.setState({
      startDate: event,
    });
  }

  handleEndDateChange(event) {
    this.setState({
      endDate: event,
    });
  }

  handleAppVersionChange(event) {
    this.setState({
      appVersion: event.target.value,
    });
    if (this.state.addBigUpdate) {
      this.setState({
        relativeVersion: event.target.value,
      });
    }
  }

  handleMinVersionChange(event) {
    this.setState({
      minVersion: event.target.value,
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

  handleViewByLanguageChange(event) {
    this.setState(
      {
        viewByLanguage: event.value,
      },
      () => {
        this.getMailSystem();
      }
    );
  }

  onSubmitClick = (e) => {
    var msg = "";
    e.preventDefault();
    axios
      .post(config.test_mail + config.url_addMail, {
        adminMail: sessionStorage.getItem("userID"),
        passWord: sessionStorage.getItem("passWord"),
        title: this.state.title,
        sender: this.state.sender,
        bannerUrl: this.state.bannerUrl,
        link: this.state.link,
        content: this.state.content,
        gifts: this.state.gifts,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        appVersion: this.state.appVersion,
        minVersion: this.state.minVersion,
        maxVersion: this.state.relativeVersion,
        isSystemMail: true,
      })
      .then(function(response) {
        console.log(response.data.Body);
        if (response.data.Status === 1) {
          msg = "Add Mail Success";
          if (this.state.startDate < new Date()) {
            axios
              .post(config.test_mail + config.url_disableMail, {
                adminMail: sessionStorage.getItem("userID"),
                passWord: sessionStorage.getItem("passWord"),
                mailId: this.state.mailIdActive,
                isSystemMail: true,
              })
              .then((response) => {
                console.log(response.data);
              })
              .catch((err) => console.log(err));
          }
        } else {
          msg = `Add Mail Err: ${response.data.Body.Err}`;
        }
      })
      .then(() => {
        window.alert(msg);
      });
  };

  onUpdateClick = (e) => {
    var msg = "";
    e.preventDefault();
    axios
      .post(config.test_mail + config.url_updateMail, {
        adminMail: sessionStorage.getItem("userID"),
        passWord: sessionStorage.getItem("passWord"),
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
          msg = "Update Mail Success";
        } else {
          msg = `Update Mail Err: ${response.data.Body.Err}`;
        }
      })
      .then(() => {
        window.alert(msg);
      });
  };

  onUpdateTemplateClick = (e) => {
    var msg = "";
    e.preventDefault();
    axios
      .post(config.test_mail + config.url_updateTemplateReward, {
        adminMail: sessionStorage.getItem("userID"),
        passWord: sessionStorage.getItem("passWord"),
        language: this.state.language,
        title: this.state.title,
        content: this.state.content,
      })
      .then(function(response) {
        console.log(response.data.Body);
        if (response.data.Status === 1) {
          msg = "Update template reward success";
        } else {
          msg = `Update template reward err: ${response.data.Body.Err}`;
        }
      })
      .then(() => {
        window.alert(msg);
      });
  };

  render() {
    const { pristine, reset, submitting } = this.props;
    const { listMailNotifySystem } = this.state;

    const LanguageOptions = [
      { value: "English", label: "English" },
      { value: "Vietnamese", label: "Vietnamese" },
      { value: "Russian", label: "Russian" },
      { value: "Spanish", label: "Spanish" },
      { value: "French", label: "French" },
      { value: "Japanese", label: "Japanese" },
      { value: "Korean", label: "Korean" },
      { value: "Thai", label: "Thai" },
      { value: "Arabic", label: "Arabic" },
      { value: "Chinese", label: "Chinese" },
      { value: "Portuguese", label: "Portuguese" },
      { value: "German", label: "German" },
      { value: "Italian", label: "Italian" },
      { value: "Indonesian", label: "Indonesian" },
      { value: "Turkish", label: "Turkish" },
    ];

    return (
      <Col md={12} lg={12} xl={12}>
        <Row>
          <div style={{ float: "left" }}>
             <Expand
              title="Update Template"
              color="secondary"
              handleClick={() => {
                this.setState({
                  updateTemplate: true,
                  isActiveAdd: false,
                  isActiveUpdate: false,
                  isBigUpdate: false,
                });
              }}
            />
          </div>
        </Row>
        <Row>
          <Card>
            <CardBody className="products-list">
              <div className="card__title">
                <h5 className="bold-text">List Mail Notify Update Version</h5>
                <div style={{ float: "right" }}>
                  <Field
                    name="viewbylanguage"
                    component={renderSelectField}
                    options={LanguageOptions}
                    value={this.state.viewByLanguage}
                    onChange={this.handleViewByLanguageChange.bind(this)}
                  />
                  <Expand
                    title="New"
                    color="secondary"
                    handleClick={() => {
                      this.setState({
                        isActiveAdd: true,
                        isActiveUpdate: false,
                        updateTemplate: false,
                      });
                    }}
                  />
                  <Expand
                    title="Add language"
                    color="primary"
                    handleClick={() => {
                      this.setState({
                        isActiveAdd: false,
                        isActiveUpdate: true,
                        updateTemplate: false,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="table">
                <Table
                  responsive
                  className="table--bordered dashboard__table-crypto"
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>_id</th>
                      <th>Title</th>
                      <th>Version</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Min Version</th>
                      <th>Big Update</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listMailNotifySystem.map((mail, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        <td dir="ltr">{mail.id}</td>
                        <td dir="ltr">{mail.title}</td>
                        <td dir="ltr">{mail.Version}</td>
                        <td>{mail.startDate}</td>
                        <td>{mail.endDate}</td>
                        <td>{mail.MinVersion}</td>
                        <td> {StatusBigUpdate(mail.isBigUpdate)}</td>
                        <td>
                          {StatusFormatter(
                            mail.isDeleted,
                            mail.startDate,
                            mail.endDate
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Row>
        {this.state.isActiveAdd ? (
          <Row>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Mail Notify Update</h5>
                  <h3 className="page-subhead subhead">
                    New Mail Use Default English Language
                  </h3>
                </div>
                <div style={{ float: "non" }}>
                  <Expand
                    title="Big Update"
                    color="secondary"
                    handleClick={() => {
                      this.setState({
                        addBigUpdate: true,
                      });
                    }}
                  />
                  <Expand
                    title="Normal"
                    color="primary"
                    handleClick={() => {
                      this.setState({
                        addBigUpdate: false,
                      });
                    }}
                  />
                </div>
                <form
                  className="form form--horizontal"
                  onSubmit={this.onSubmitClick}
                >
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
                        component={renderField}
                        type="text"
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
                        type="text"
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
                  {this.state.addBigUpdate ? (
                    <div className="form__form-group">
                      <span className="form__form-group-label">Gifts</span>
                      <div className="form__form-group-field">
                        <Field
                          name="gifts"
                          component="input"
                          type="text"
                          placeholder="Nhập các phần quà dạng string, string ( cách nhau bởi dấu phẩy)"
                          value={this.state.gifts}
                          onChange={this.handleGiftChange.bind(this)}
                        />
                      </div>
                    </div>
                  ) : null}

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
                    <span className="form__form-group-label">End Date</span>
                    <div className="form__form-group-field">
                      <Field
                        name="enddate"
                        component={renderDateTimePickerField}
                        value={this.state.endDate}
                        onChange={this.handleEndDateChange.bind(this)}
                      />
                      <div className="form__form-group-icon">
                        <TimetableIcon />
                      </div>
                    </div>
                  </div>
                  <Container>
                    <Row>
                      <Col md={6} xl={6}>
                        <div className="form__form-group">
                          <span className="form__form-group-label">
                            App Version
                          </span>
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
                      <Col md={6} xl={6}>
                        <div className="form__form-group">
                          <span className="form__form-group-label">
                            Min Version
                          </span>
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
                    </Row>
                  </Container>
                  <ButtonToolbar className="form__button-toolbar">
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset();
                        this.setState({ isActiveAdd: false });
                      }}
                      disabled={pristine || submitting}
                    >
                      Cancel
                    </Button>
                  </ButtonToolbar>
                </form>
              </CardBody>
            </Card>
          </Row>
        ) : null}
        {this.state.isActiveUpdate ? (
          <Row>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Mail System</h5>
                  <h3 className="page-subhead subhead">
                    Add Language for Mail System
                  </h3>
                </div>
                <form
                  className="form form--horizontal"
                  onSubmit={this.onUpdateClick}
                >
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

                  <ButtonToolbar className="form__button-toolbar">
                    <Button color="primary" type="submit">
                      Update
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset();
                        this.setState({ isActiveUpdate: false });
                      }}
                      disabled={pristine || submitting}
                    >
                      Cancel
                    </Button>
                  </ButtonToolbar>
                </form>
              </CardBody>
            </Card>
          </Row>
        ) : null}
        {this.state.updateTemplate ? (
          <Row>
            <Card>
              <CardBody>
                <div className="card__title">
                  <h5 className="bold-text">Template Reward</h5>
                  <h3 className="page-subhead subhead">
                    Update Language for mail reward update new app version
                  </h3>
                </div>
                <form
                  className="form form--horizontal"
                  onSubmit={this.onUpdateTemplateClick}
                >
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

                  <ButtonToolbar className="form__button-toolbar">
                    <Button color="primary" type="submit">
                      Update
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset();
                        this.setState({ updateTemplate: false });
                      }}
                      disabled={pristine || submitting}
                    >
                      Cancel
                    </Button>
                  </ButtonToolbar>
                </form>
              </CardBody>
            </Card>
          </Row>
        ) : null}
      </Col>
    );
  }
}

export default reduxForm({
  form: "horizontal_form_validation", // a unique identifier for this form
  validate,
})(withTranslation("common")(MailNotifyVersion));
