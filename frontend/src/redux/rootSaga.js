import { all } from 'redux-saga/effects';
import { watchLoginSaga } from './sagas/userSaga';

export default function* rootSaga() {
    yield all([
        watchLoginSaga(),
    ]);
}
