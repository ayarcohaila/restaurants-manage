import userSaga from '../user/redux/saga';
import restaurantSaga from '../restaurant/redux/saga';
import reviewSaga from '../review/redux/saga';

export default function* appSaga() {
  yield []
    .concat(userSaga)
    .concat(restaurantSaga)
    .concat(reviewSaga);
}
