/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHeader from './shared/DashboardHeader';
import DashboardSidebar from './shared/DashboardSidebar';
import Table from './shared/Table';
import ApiRoute from '../../utils/apiRoutes';
import setAuthToken from '../../utils/setAuthToken';
import setGlobalLoader from '../../redux/actions/dashboardLoaderActions';
// import { deleteDiscountCoupon } from '../../redux/actions/discountActions';

export default function DiscountCoupons() {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [discountCoupons, setDiscountCoupons] = useState([]);
  const authReducer = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (authReducer?.user?.userType !== '0') {
      navigate('/dashboard');
    }
  }, [authReducer]);

  // const handleDelete = async (rowData) => {
  //   const text = `Do you want to delete ${rowData.name} coupon ?`;

  //   if (window.confirm(text) === true) {
  //     dispatch(deleteDiscountCoupon(rowData.id)).then(res => {
  //       if (res.status === 200) {
  //         toast.success(`${rowData.name} coupon is deleted successfully`);
  //         setDiscountCoupons(discountCoupons.filter((d) => d.id !== rowData.id));
  //       }
  //     })
  //       .catch(error => {
  //         console.log(error);
  //         toast.error('some error occured while deleting the coupon;');
  //       })
  //   } else {
  //     toast.success('Deletion request cancelled.');
  //   }
  // };

  const columns = [
    { title: 'Name', field: 'name', filtering: false },
    { title: 'Type', field: 'type', filtering: false },
    { title: 'Status', field: 'active', filtering: false },
    { title: 'Amount', field: 'amount', filtering: false },
    {
      title: 'Actions',
      field: '',
      filtering: false,
      render: (rowData) => (
        <div className="tableActions ">
          <Tooltip title="Edit Coupon">
            <i
              className="icon-pencil ml-2"
              role="button"
              onClick={() => navigate(`/discount-coupons/edit/${rowData.id}`)}
            />
          </Tooltip>
          {/* <Tooltip title="Delete Coupon">
            <i
              className="icon-trash ml-2 text-danger"
              role="button"
              onClick={() => handleDelete(rowData)}
            />
          </Tooltip> */}
        </div>
      ),
    },
  ];

  async function getDiscountCoupons() {
    setGlobalLoader(true);
    try {
      const res = await axios.get(ApiRoute.getDiscountCoupons);
      console.log(res)

      if (res.status === 200) {
        const data = res.data.map((d) => ({
          /* eslint-disable  no-underscore-dangle */
          id: d._id,
          name: d?.name,
          type: d?.type,
          amount: d?.amount,
          active: d?.active ? 'Active' : 'Inactive',
        }));
        setDiscountCoupons(data);
        setGlobalLoader(false);
      }

      return;
    } catch (error) {
      console.log(error);
      setGlobalLoader(false);
      toast.error('some error occured while getting the list of discount coupons');
    }
  }

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    } else {
      console.log('no token to send');
      return;
    }
    getDiscountCoupons();
  }, []);

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
                <div className="page-title d-flex justify-content-between">
                  <h4>
                    <span className="font-weight-semibold">Discount Coupons</span>
                  </h4>
                  <div>
                    <Link className="btn btn-primary" type="button" to='/discount-coupons/add'>
                      Add Coupon
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- /page header --> */}

            {/* <!-- Basic layout--> */}
            <div className="content">
              <Table
                columns={columns}
                data={discountCoupons}
                export={false}
                // search
                selection={false}
                toolbar
                title="Coupons"
              />
            </div>

            {/* <!-- /basic layout --> */}
          </div>
        </div>
      </div>
    </>
  );
}
