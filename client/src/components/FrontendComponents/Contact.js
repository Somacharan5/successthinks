import React, { Suspense } from 'react';
import Preloader from '../sharedComponents/Preloader';

const Footer = React.lazy(() => import('../sharedComponents/Footer'));
const Navbar = React.lazy(() => import('../sharedComponents/Navbar'));

export default function Contact() {
  return (
    <Suspense fallback={Preloader}>
      <>
        {/* <Preloader /> */}
        <Navbar />

        {/* <!--page-title area--> */}
        <section className="page-title-area" id="contact-us-header">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <img
                  src="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1650883490/7_wnonxo.png"
                  id="contact-form-image"
                  alt=""
                />
              </div>
              <div className="col-lg-6 contact-us-page-title col-sm-12 mt-5">
                <h2>I am Here To listen you</h2>
                <p>
                  Any personal Question query, complaint, suggestion, message
                  wishes are always welcome
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <!--page-title area end-->   */}

        <div className="pd-top-150">
          <div className="text-center">
            <h2>Contact Details</h2>
          </div>
          <br/>
          <div className="row d-flex justify-content-around">
            <div>
              <p className='contact-details'>
                Phone Number :
              </p>
              <p>
                +91 90598 79677
              </p>
            </div>
            <div>
            <p className='contact-details'>
                Email :
              </p>
              <p>
                Business@successthinks.com
              </p>
            </div>            
            <div>
            <p className='contact-details'>
                Address :
              </p>
              <p>
                6-5/9 first floor, Old Patel&apos;s building,<br/>
                Veera raghava reddy colony,<br/>
                Annaram Opp AFA, Hyderabad,<br/>
                Telangana 502313
              </p>
            </div>
          </div>
        </div>

        {/* <!-- contact area Start --> */}
        <div className="contact-area pd-top-150 pd-bottom-120">
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <form className="login-area-inner pr-lg-4">
                  <h2>Leave us a Message</h2>
                  <p>One step ahead to share your Thought</p>
                  <label className="single-input-inner no-checkbox">
                    <span>Full Name*</span>
                    <input type="text" placeholder="Your Full Name" />
                  </label>
                  <label className="single-input-inner no-checkbox">
                    <span>Email</span>
                    <input type="email" placeholder="Your Email" />
                  </label>
                  <label className="single-input-inner no-checkbox">
                    <span>Phone Number</span>
                    <input type="number" placeholder="Your Phone Number" />
                  </label>
                  <label className="single-input-inner no-checkbox">
                    <span>Message</span>
                    <textarea placeholder="Your Message" />
                  </label>
                  <div className="nav-right-part  button-new-css-design">
                    <button className="btn btn-red mt-3" type="button">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-lg-7 mt-lg-0 mt-5">
                <img
                  src="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1650883490/8_lrvxn0.png"
                  id="contact-form-image-right"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        {/* <!-- contact area End --> */}
        <Footer />
      </>
    </Suspense>
  );
}
