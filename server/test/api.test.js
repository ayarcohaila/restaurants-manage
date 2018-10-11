const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const backendMiddleware = require('../middlewares/backendMiddleware');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const app = express();

describe('api', () => {
  beforeAll(done => {
    backendMiddleware(app, done);
  });

  afterAll(done => {
    User.deleteMany({ email: 'user@test.com' }).then(() => {
      mongoose.disconnect();
      done();
    });
  });

  describe('auth', () => {
    test('should successfully register', () =>
      request(app)
        .post('/api/auth/signup')
        .send({
          email: 'user@test.com',
          password: 'test123',
          role: 'user',
          firstName: 'test',
          lastName: 'user',
        })
        .then(resp => {
          expect(resp.statusCode).toBe(200);
        }));

    test('should fail login with wrong credentials', () =>
      request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'test1',
        })
        .then(resp => {
          expect(resp.statusCode).toBe(401);
          expect(resp.body.message).toBe('Email or password does not match');
        }));

    test('should successfully login with correct credentials', () =>
      request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'test123',
        })
        .then(resp => {
          expect(resp.statusCode).toBe(200);
        }));
  });

  describe('Restaurant', () => {
    let authToken = '';
    let userId = '';

    const testRestaurant = {
      name: 'new',
    };

    const user = new User({
      firstName: 'User1',
      lastName: 'Test1',
      email: 'user1@test1.com',
      password: 'test1',
      role: 'admin',
    });

    beforeAll(done => {
      user.save().then(newUser => {
        userId = newUser._id;
        authToken = `Bearer ${jwt.sign(
          {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
          },
          config.jwtSecret,
          { expiresIn: config.jwtExpires },
        )}`;
        done();
      });
    });

    afterAll(done => {
      Restaurant.deleteMany({ user: userId }).then(() => {
        User.deleteOne({ _id: userId }).then(() => {
          done();
        });
      });
    });

    test('should create restaurant', () =>
      request(app)
        .post('/api/restaurants/')
        .set('Authorization', authToken)
        .send({
          name: testRestaurant.name,
        })
        .then(resp => {
          expect(resp.statusCode).toBe(200);
        }));

    test('should get restaurants list', () =>
      request(app)
        .get('/api/restaurants/')
        .set('Authorization', authToken)
        .then(resp => {
          expect(resp.statusCode).toBe(200);
        }));

    describe('Restaurant detail', () => {
      let currentRestaurantId = '';

      beforeAll(done => {
        const crudRestaurant = {
          name: 'Test',
          user: userId,
        };
        Restaurant.create(crudRestaurant).then(newRestaurant => {
          currentRestaurantId = newRestaurant._id;
          done();
        });
      });

      test('should read restaurant', () =>
        request(app)
          .get(`/api/restaurants/${currentRestaurantId}`)
          .set('Authorization', authToken)
          .then(resp => {
            expect(resp.statusCode).toBe(200);
          }));

      test('should update restaurant', () => {
        testRestaurant.name = 'place';
        return request(app)
          .put(`/api/restaurants/${currentRestaurantId}`)
          .set('Authorization', authToken)
          .send({
            name: testRestaurant.name,
          })
          .then(resp => {
            expect(resp.body.name).toBe('place');
          });
      });

      test('should delete restaurant', () =>
        request(app)
          .delete(`/api/restaurants/${currentRestaurantId}`)
          .set('Authorization', authToken)
          .then(resp => {
            expect(resp.statusCode).toBe(200);
          }));
    });
    // afterAll(() => mongoose.disconnect());
  });
  afterAll(() => mongoose.disconnect());
});
