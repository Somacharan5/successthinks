const IS_PROD = process.env.NODE_ENV === 'production';
const baseURL = IS_PROD ? '' : 'http://localhost:4000';

/* eslint-disable */

const API_ROUTES = {

  // note 2 create users options will be there, one for user and one for admin

  // user management
  createUser: baseURL + '/user',
  editUserSelf: baseURL + '/user',
  editUserImage: baseURL + '/user/image/{uuid}',
  getIncome: baseURL + '/user/income',
  getLeaderboardDetails: baseURL + '/user/leaderboard',
  forgotPasswordRequest: baseURL + '/user/forgot-password',
  resetPasswordRequest: baseURL + '/user/reset-password',
  getReferrerName: baseURL + '/user/referrer-name/{uuid}',

  // withdrawal Requests
  getWithDrawalRequests: baseURL + '/withdrawal-request',

  // notification requests
  getNotifications: baseURL + '/notification',

  // Bank Information
  addBankInformation: baseURL + '/bank',
  getBankInformation: baseURL + '/bank',

  // razorpay
  createOrder: baseURL + '/payment/razorpay_create_orders',
  confirmOrder: baseURL + '/payment/catch_payment/{userreference}',

  // auth routes
  auth: baseURL + '/auth',

  // video
  addVideo: baseURL + '/video',
  getVideos: baseURL + '/video/',
  deleteVideo: baseURL + '/video/',

  // video topics
  addVideoTopic: baseURL + '/video-topic',
  deleteVideoTopic: baseURL + '/video-topic/',
  getVideoTopics: baseURL + '/video-topic',

  // admin routes
  addUser: baseURL + '/admin/user',
  getUsers: baseURL + '/admin/users',
  getUsersIncome: baseURL + '/admin/users/income',
  deleteUser: baseURL + '/admin/user/{uuid}',
  getAllDetailsOfUser: baseURL + '/admin/user/{uuid}/all-details',
  editUser: baseURL + '/admin/user/{uuid}',
  registerWithdrawalPayment: baseURL + '/admin/withdrawal-request',
  addNotification: baseURL + '/notification',

  // help routes
  getHelpLink: baseURL + '/help-request',

  // discount coupon routes for admin
  getDiscountCoupons: baseURL + '/discount-coupon',
  getDiscountCouponById: baseURL + '/discount-coupon/{id}',
  addDiscountCoupon: baseURL + '/discount-coupon',
  editDiscountCoupon: baseURL + '/discount-coupon/{id}',
  deleteDiscountCoupon: baseURL + '/discount-coupon/{id}',
  verifyDiscountCoupon: baseURL + '/discount-coupon/verify',
};

export default API_ROUTES;
