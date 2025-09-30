/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, ErrorMessage } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import DashboardHeader from './shared/DashboardHeader';
import DashboardSidebar from './shared/DashboardSidebar';
import { addDiscountCoupon, getDiscountCouponById, editDiscountCoupon } from '../../redux/actions/discountActions';
import setGlobalLoader from '../../redux/actions/dashboardLoaderActions';

export default function AddVideo() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [discountCouponDetails, setDiscountCouponDetails] = useState(null);
  const authReducer = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (authReducer?.user?.userType !== '0') {
      navigate('/dashboard');
    }
  }, [authReducer]);

  useEffect(() => {
    dispatch(getDiscountCouponById(params.id))
      .then((res) => {
        if (res.status === 200) {
          setGlobalLoader(false);
          setDiscountCouponDetails(res.data)
        } else {
          toast.error('Some error occured while getting details for this coupon.');
        }
      })
      .catch((error) => {
        console.log(error);
        setGlobalLoader(false);
        toast.error(error.response.data.errors[0].msg);
      });
  }, [params.id]);

  const discountTypeOptions = [
    { label: 'Percentage', value: 'percentage' },
    { label: 'Flat', value: 'flat' },
  ];

  const statusTypeOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  const handleOnSubmit = async (values) => {

    setGlobalLoader(true);

    if (params.id) {

      dispatch(editDiscountCoupon(values, params.id))
        .then((res) => {
          if (res.status === 200) {
            setGlobalLoader(false);
            toast.success('Discount coupon updated successfully');
            navigate('/discount-coupons')
          } else {
            toast.error('Some error occured while updating this coupon.');
          }
        })
        .catch((error) => {
          console.log(error);
          setGlobalLoader(false);
          toast.error(error.response.data.errors[0].msg);
        })
    } else {
      dispatch(addDiscountCoupon(values))
        .then((res) => {
          if (res.status === 200) {
            setGlobalLoader(false);
            toast.success('Discount coupon created successfully');
            navigate('/discount-coupons')
          } else {
            toast.error('Some error occured while creating this coupon.');
          }
        })
        .catch((error) => {
          console.log(error);
          setGlobalLoader(false);
          toast.error(error.response.data.errors[0].msg);
        });
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: params.id ? discountCouponDetails?.name : '',
        type: params.id ? discountCouponDetails?.type : '',
        amount: params.id ? discountCouponDetails?.amount : '',
        active: params.id ? discountCouponDetails?.active : false,
      }}
      onSubmit={handleOnSubmit}
      validationSchema={yup.object().shape({
        name: yup.string().required('This field is required.'),
        type: yup.string().required('This field is required.'),
        amount: yup.string().required('This field is required.'),
        // active: yup.bool().required('This field is required.'),
      })}
    >
      {(props) => {
        const { setFieldValue, handleSubmit, values } = props;
        return (
          <>
            <DashboardHeader />
            <div className="page-content">
              <DashboardSidebar />
              {/* <!-- Main content --> */}
              <div className="content-wrapper">
                {/* <!-- Inner content --> */}
                <div className="content-inner">
                  {/* <!-- Page header --> */}
                  <div className="page-header page-header-light">
                    <div className="page-header-content header-elements-lg-inline">
                      <div className="page-title d-flex">
                        <h4>
                          <span className="font-weight-semibold">
                            {params.id ? 'Edit' : "Add"} Discount Coupon
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                  {/* <!-- /page header --> */}

                  {/* <!-- Basic layout--> */}
                  <div className="container mt-3">
                    <div className="container">
                      <div className="card">
                        <div className="card-header">
                          <h5 className="card-title">
                            All Details are mandatory
                          </h5>
                        </div>

                        <div className="card-body">
                          <form onSubmit={handleSubmit}>
                            <div className="form-group">
                              <label>Name:</label>
                              <input
                                value={values.name}
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                onChange={(e) =>
                                  setFieldValue('name', e.target.value)
                                }
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="form-group">
                              <label className="d-block">
                                Type:
                                <Select
                                  value={discountTypeOptions.filter(
                                    (d) => d.value === values.type
                                  )}
                                  placeholder="Discount Type"
                                  options={discountTypeOptions}
                                  onChange={(e) =>
                                    setFieldValue('type', e.value)
                                  }
                                />
                                <ErrorMessage
                                  name="type"
                                  component="div"
                                  className="text-danger"
                                />
                              </label>
                            </div>
                            <div className="form-group">
                              <label>Amount:</label>
                              <input
                                type="number"
                                value={values.amount}
                                className="form-control"
                                placeholder="Amount"
                                onChange={(e) =>
                                  setFieldValue('amount', e.target.value)
                                }
                              />
                              <ErrorMessage
                                name="amount"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="form-group">
                              <label className="d-block">
                                Status
                                <Select
                                  value={statusTypeOptions.filter(
                                    (d) => d.value === values.active
                                  )}
                                  placeholder="Status"
                                  options={statusTypeOptions}
                                  onChange={(e) =>
                                    setFieldValue('active', e.value)
                                  }
                                />
                                <ErrorMessage
                                  name="active"
                                  component="div"
                                  className="text-danger"
                                />
                              </label>
                            </div>

                            <div className="text-right">
                              <button type="submit" className="btn btn-primary">
                                Submit form
                                <i className="icon-paperplane ml-2" />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- /basic layout --> */}
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
}
