import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import FontAwesome from 'react-fontawesome';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  PageHeader,
  ControlLabel,
  InputGroup,
} from 'react-bootstrap';
import { signupRequest } from '../redux/actions';

class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    };
  }

  onChange = field => evt => {
    this.setState({ [field]: evt.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const { email, firstName, lastName, password } = this.state;
    this.props.signupRequest({ email, firstName, lastName, password });
  };

  render() {
    const { email, firstName, lastName, password } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={4} xsOffset={4}>
            <PageHeader>Sign up a new account</PageHeader>
            <Form horizontal onSubmit={this.onSubmit}>
              <FormGroup controlId="firstName">
                <Col componentClass={ControlLabel} sm={4}>
                  First Name
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="user" />
                    </InputGroup.Addon>
                    <FormControl
                      value={firstName}
                      onChange={this.onChange('firstName')}
                      placeholder="First Name"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="lastName">
                <Col componentClass={ControlLabel} sm={4}>
                  Last Name
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="user" />
                    </InputGroup.Addon>
                    <FormControl
                      value={lastName}
                      onChange={this.onChange('lastName')}
                      placeholder="Last Name"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="email">
                <Col componentClass={ControlLabel} sm={4}>
                  E-mail
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="envelope" />
                    </InputGroup.Addon>
                    <FormControl
                      type="email"
                      value={email}
                      onChange={this.onChange('email')}
                      placeholder="E-mail address"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup controlId="password">
                <Col componentClass={ControlLabel} sm={4}>
                  Password
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="key" />
                    </InputGroup.Addon>
                    <FormControl
                      value={password}
                      onChange={this.onChange('password')}
                      placeholder="Password"
                      type="password"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col smOffset={4} sm={3}>
                    <Button bsStyle="primary" type="submit">
                      <FontAwesome name="user-plus" />
                      &nbsp;&nbsp;Sign up
                    </Button>
                  </Col>
                  <Col sm={5}>
                    <Link to="/login" href="/login" className="signup-link">
                      Go back to log in
                    </Link>
                  </Col>
                </Row>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

SignupPage.propTypes = {
  signupRequest: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {
  signupRequest,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(SignupPage);
