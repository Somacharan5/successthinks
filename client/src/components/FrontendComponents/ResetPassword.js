import React, { Suspense, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { resetPasswordRequest } from '../../redux/actions/userActions';
import Preloader from '../sharedComponents/Preloader';


const Footer = React.lazy(() => import('../sharedComponents/Footer'));
const Navbar = React.lazy(() => import('../sharedComponents/Navbar'));
export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const token = searchParams.get('token')

  const handleSubmit = () => {
    const data = { password, token }
    dispatch(resetPasswordRequest(data))
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.msg);
          navigate('/login');
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.msg);
      });
  }
  return (
    <Suspense fallback={Preloader}>
      <>
        <link rel="stylesheet" href="assets/css/vendor.css" />
        <link rel="stylesheet" href="assets/css/style.css" />
        <link rel="stylesheet" href="assets/css/responsive.css" />
        {/* <Preloader /> */}
        <Navbar />

        {/* <!-- error page start --> */}
        <div className="error-area">
          <div className="container">
            <div className="error-area-inner">
              <div className="row justify-content-center">
                <h3>Reset Password</h3>

                <div className="col-xl-8 col-lg-8 col-md-10 text-center">
                  <br />
                  <br />
                  <label className="single-input-inner">
                    <span className="h3">Set a new password</span>
                    <input
                      type="password"
                      placeholder="*******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* <i className="la la-check"></i> */}
                  </label>
                  <button className="btn btn-red w-100 mt-3" type='button' onClick={() => handleSubmit()}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- error page end -->  */}
        <Footer />
      </>
    </Suspense>
  );
}
