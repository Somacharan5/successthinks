import axios from 'axios';
import ApiRoute from '../../utils/apiRoutes';

/**
 * add a discount coupon
 * @param {Object} data
 */
export const addDiscountCoupon = (data) => async () => {
    const res = await axios.post(ApiRoute.addDiscountCoupon, data);
    return res;
};

/**
 * apply discount coupon
 */
export const verifyDiscountCoupon = (data) => async () => {
    const res = await axios.post(ApiRoute.verifyDiscountCoupon, data);
    return res;
};

/**
 * get a discount coupon by Id
 */
export const getDiscountCouponById = (id) => async () => {
    const res = await axios.get(`${ApiRoute.getDiscountCouponById.replace('{id}', id)}`);
    return res;
}


/**
 * delete a discount coupon
 */
export const deleteDiscountCoupon = (id) => async () => {
    const res = await axios.delete(`${ApiRoute.deleteDiscountCoupon.replace('{id}', id)}`);
    return res;
}

/**
 * edit a discount coupon
 * @param {Object} data
 */
export const editDiscountCoupon = (data, id) => async () => {
    const res = await axios.patch(`${ApiRoute.editDiscountCoupon.replace('{id}', id)}`, data);
    return res;
}