import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Popup from '../DashboardComponents/shared/Popup';
import SignupForm from './SignupForm';
import { loadUser } from '../../redux/actions/authActions';
import ApiRoute from '../../utils/apiRoutes';
import setGlobalLoader from '../../redux/actions/dashboardLoaderActions';
import { REGISTER_SUCCESS } from '../../redux/actions/types';

export default function Product({
  image,
  varClass,
  productName,
  productPrice,
  validPoints,
  invalidPoints,
  productId,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [discountCoupon, setDiscountCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [effectivePrice, setEffectivePrice] = useState(productPrice);
  const [modalContent, setModalContent] = useState('');

  const handleOnSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error(`Passwords don't match, Please try again`);
      return;
    }
    setOpenModal(false);

    const { orderDetails, ...userDetails } = values;

    const options = {
      key:
        process.env.NODE_ENV === 'production'
          ? 'rzp_live_zsBeaqpN9hmtbD'
          : 'rzp_test_QokU5cHvuporJd',
      amount: orderDetails.amount,
      currency: 'INR',
      name: 'Success Thinks',
      description: productName,
      image:
        'https://res.cloudinary.com/dtqrvcvp8/image/upload/v1650883782/1_vp11ij.png',
      order_id: orderDetails.id,
      handler: async (response) => {
        const paymentData = {
          product: parseInt(productId, 10),
          price: parseInt(effectivePrice, 10),
          discount : parseInt(discountAmount, 10),
          discountCoupon,
          razorpay_signature: response.razorpay_signature,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
        };

        try {
          const res = await axios.post(ApiRoute.createUser, {
            paymentData,
            ...userDetails,
          });

          if (res.status === 200) {
            toast.success('Registration Successful');
            dispatch({
              type: REGISTER_SUCCESS,
              payload: res.data,
            });
            dispatch(loadUser());
            navigate('/dashboard');
            window.location.reload();
          }
          return;
        } catch (error) {
          console.log(error.response);
          toast.error(error.response.data);
        }
      },
    };

    // eslint-disable-next-line no-undef
    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', (response) => {
      toast.error(response.error.description);
    });
  };

  const createUserModal = (orderDetails, introducerreference) =>
    SignupForm(handleOnSubmit, orderDetails, introducerreference);

  const registerUserProcess = async () => {
    setGlobalLoader(true);
    const data = { price: parseInt(effectivePrice, 10) };

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);

    try {
      const res = await axios.post(
        ApiRoute.createOrder,
        data
      );

      if (res.status === 200) {
        setGlobalLoader(false);
        setOpenModal(true);
        setModalContent(createUserModal(res.data, Cookies.get('referer')));
      }

      return;
    } catch (error) {
      console.log(error);
      toast.error(
        'some error occured while creating order. Please refresh the page.'
      );
    }
  };

  const applyDiscountCoupon = async () => {

    if (discountCoupon === '') {
      toast.error(
        'Please enter a Discount Coupon.'
      );
      return;
    }

    const data = {
      coupon: discountCoupon,
      price: productPrice,
    }
    try {
      setGlobalLoader(true);
      const res = await axios.post(
        ApiRoute.verifyDiscountCoupon,
        data
      );

      if (res.status === 200) {
        setGlobalLoader(false);
        if (res.data.valid === true) {
          setEffectivePrice(res.data.price);
          setDiscountAmount(res.data.discount);
          toast.success(
            "Coupon Applied Succesfully"
          );
        } else {
          setEffectivePrice(productPrice);
          setDiscountAmount(0);
          toast.error(
            "Invalid Coupon."
          );
        }
      }

    } catch (error) {
      setGlobalLoader(false);
      console.log(error);
      toast.error(
        'some error occured while verifying discount coupon. Please try again later.'
      );
    }
  }

  return (
    <div className={varClass}>
      <div className="single-ticket-price-inner text-center">
        <div className="icon">
          <img src={image} alt="img" className="product-page-product-image" />
        </div>
        <h2 className="title">{productName}</h2>
        <h2 className="price">Rs {productPrice}</h2>
        <div className="list">
          <ul>
            {validPoints?.map((d) => (
              <li>
                <i className="fa fa-check" />
                {d}
              </li>
            ))}

            {invalidPoints?.map((d) => (
              <li>
                <i className="fa fa-times text-danger" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <div className="col-3">
            <span>Coupon</span>
          </div>
          <div className="col-7">
            <input
              className="col-12"
              type="text"
              placeholder="Discount Coupon"
              onChange={(e) => setDiscountCoupon(e.target.value)}
            />
          </div>
          <div className="col-2">
            <button
              style={{ all: 'unset', cursor: 'pointer', color: 'red' }}
              type="button"
              onClick={() => applyDiscountCoupon()}
            >
              Apply
            </button>
          </div>
        </div>
        {discountAmount > 0 &&
          <div className='mt-3 text-danger'>
            <h6 className='text-danger'>Discount Applied : {discountAmount}</h6>
            <h6 className='text-danger'>Effective Price : {effectivePrice}</h6>
          </div>
        }
        <div className="nav-right-part button-new-css-design w-100">
          <button
            style={{marginTop : '20px'}}
            className="btn btn-red"
            onClick={() => {
              registerUserProcess();
            }}
            type="button"
          >
            <img src="assets/img/icon/1.png" alt="img" />
            Buy Now
          </button>
        </div>
      </div>
      <Popup
        setOpenModal={setOpenModal}
        openModal={openModal}
        maxWidth="md"
        Title="Please enter your details"
        Content={modalContent}
      />
    </div>
  );
}
