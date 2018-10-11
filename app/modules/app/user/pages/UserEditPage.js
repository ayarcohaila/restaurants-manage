import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
  PageHeader,
} from 'react-bootstrap';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import {
  userLoadRequest,
  updateUserField,
  userSaveRequest,
  loadNewUser,
} from '../redux/actions';
import { makeSelectUser, makeSelectUserLoading } from '../redux/selectors';

class UserPage extends Component {
  componentWillMount() {
    this.loadUser(this.props.match.params.id); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.loadUser(nextProps.match.params.id);
    }
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.userSave();
  };

  onUpdateField = field => evt => {
    this.props.updateField(field, evt.target.value);
  };

  onRoleChange = e => {
    this.props.updateField('role', e.value);
  };

  loadUser = id => {
    if (id === 'new') {
      this.props.loadNewUser();
    } else {
      this.props.userLoad(id);
    }
  };

  render() {
    const { currentUser, user } = this.props;

    const options = [
      { value: 'user', label: 'User' },
      { value: 'owner', label: 'Owner' },
      { value: 'admin', label: 'Admin' },
    ];

    const selectedValue = !options.filter(
      option => option.value === user.get('role'),
    )[0]
      ? options[0]
      : options.filter(option => option.value === user.get('role'))[0];

    return (
      <Grid fluid>
        <Row>
          <Col xs={6} xsOffset={3}>
            <PageHeader>
              {user.get('_id') ? 'Edit User' : 'New User'}
            </PageHeader>
            <Form horizontal onSubmit={this.onSubmit}>
              <FormGroup controlId="firstName">
                <Col componentClass={ControlLabel} sm={3}>
                  First Name :
                </Col>
                <Col sm={9}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="user" />
                    </InputGroup.Addon>
                    <FormControl
                      value={user.get('firstName') || ''}
                      onChange={this.onUpdateField('firstName')}
                      placeholder="First Name"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="lastName">
                <Col componentClass={ControlLabel} sm={3}>
                  Last Name :
                </Col>
                <Col sm={9}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="user" />
                    </InputGroup.Addon>
                    <FormControl
                      value={user.get('lastName') || ''}
                      onChange={this.onUpdateField('lastName')}
                      placeholder="Last Name"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="email">
                <Col componentClass={ControlLabel} sm={3}>
                  Email :
                </Col>
                <Col sm={9}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="envelope" />
                    </InputGroup.Addon>
                    <FormControl
                      value={user.get('email') || ''}
                      onChange={this.onUpdateField('email')}
                      placeholder="E-mail"
                      type="email"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="password">
                <Col componentClass={ControlLabel} sm={3}>
                  Password :
                </Col>
                <Col sm={9}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="key" />
                    </InputGroup.Addon>
                    <FormControl
                      type="password"
                      value={user.get('password') || ''}
                      onChange={this.onUpdateField('password')}
                      placeholder="Password"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              {currentUser.get('role') === 'admin' && (
                <FormGroup controlId="role">
                  <Col componentClass={ControlLabel} sm={3}>
                    Role :
                  </Col>
                  <Col sm={9}>
                    <Select
                      options={options}
                      isSearchable={false}
                      onChange={this.onRoleChange}
                      value={selectedValue}
                      placeholder="Please choose a role"
                    />
                  </Col>
                </FormGroup>
              )}
              <Col smOffset={5}>
                <Button bsStyle="primary" type="submit">
                  Save
                </Button>&nbsp;&nbsp;
                <Link
                  className="signup-link btn btn-default"
                  role="button"
                  to="/users"
                  href="/users"
                >
                  Cancel
                </Link>
              </Col>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

UserPage.propTypes = {
  userSave: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  userLoad: PropTypes.func.isRequired,
  loadNewUser: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  currentUser: makeSelectCurrentUser(),
  loading: makeSelectUserLoading(),
});

const mapDispatchToProps = {
  userLoad: userLoadRequest,
  updateField: updateUserField,
  userSave: userSaveRequest,
  loadNewUser,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(UserPage);
