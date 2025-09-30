import axios from 'axios';
import ApiRoute from '../../utils/apiRoutes';
import {
  PRODUCT_VIDEOS_LOADED,
  TRAINING_VIDEOS_LOADED
} from './types';

/**
 * add a video
 * @param {Object} data
 */
export const addVideo = (data) => async () => {
  const res = await axios.post(ApiRoute.addVideo, data);

  return res;
};

/**
 * get a videos
 */
export const getVideos = () => async () => {
  const res = await axios.get(ApiRoute.getVideos);

  return res;
};

/**
 * load videos according to product of user
 */
export const loadProductVideos = (data) => async (dispatch) => {
  dispatch({
    type: PRODUCT_VIDEOS_LOADED,
    payload: data,
  });
};

/**
 * load training videos
 */
export const loadTrainingVideos = (data) => async (dispatch) => {
  dispatch({
    type: TRAINING_VIDEOS_LOADED,
    payload: data,
  });
};