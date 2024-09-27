import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { fetchPostsSuccess, fetchPostsFailure } from './actions';

function* fetchPostsSaga() {
    try {
        const response = yield call(axios.get, 'https://jsonplaceholder.typicode.com/posts');
        yield put(fetchPostsSuccess(response.data));
    } catch (error) {
        yield put(fetchPostsFailure(error));
    }
}

function* rootSaga() {
    yield takeLatest('FETCH_POSTS_REQUEST', fetchPostsSaga);
}

export default rootSaga;
