import axios from 'axios';
import ApiRoute from '../../utils/apiRoutes';

/**
 * get a video Topics
 */
export const getVideoTopics = () => async () => {
    const res = await axios.get(ApiRoute.getVideoTopics);
    return res;
};

/**
 * add a video Topic
 * @param {Object} data
 */
export const addVideoTopic = (data) => async () => {
    const res = await axios.post(ApiRoute.addVideoTopic, data);
    return res;
};

/**
 * delete a video Topic
 * @param {Object} data
 */
export const deleteVideoTopic = (id) => async () => {
    const res = await axios.delete(`${ApiRoute.deleteVideoTopic}${id}`);
    return res;
}