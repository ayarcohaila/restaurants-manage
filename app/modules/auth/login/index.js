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
import { loginRequest } from '../redux/actions';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  onChange = field => evt => {
    this.setState({ [field]: evt.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.loginRequest(email, password);
  };

  render() {
    const { email, password } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={6} xsOffset={2}>
            <Row>
              <Col smOffset={4}>
                <PageHeader>Log in your account</PageHeader>
              </Col>
            </Row>
            <Form horizontal onSubmit={this.onSubmit}>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={4}>
                  Email
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="envelope" />
                    </InputGroup.Addon>
                    <FormControl
                      value={email}
                      type="text"
                      onChange={this.onChange('email')}
                      placeholder="E-mail address"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
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
                    <Button bsStyle="primary" type="submit" size="large">
                      Login
                    </Button>
                  </Col>
                  <Col sm={5}>
                    <Link
                      className="signup-link btn btn-default"
                      role="button"
                      to="/signup"
                      href="/signup"
                    >
                      Click here to sign up
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

LoginPage.propTypes = {
  loginRequest: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = {
  loginRequest,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LoginPage);
