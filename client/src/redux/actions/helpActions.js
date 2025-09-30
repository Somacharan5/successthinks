import axios from 'axios';
import ApiRoute from '../../utils/apiRoutes';

/**
 * get help Link
 */
const getHelpLink = () => async () => {
  const res = await axios.get(ApiRoute.getHelpLink);
  return res;
};

export default getHelpLink;