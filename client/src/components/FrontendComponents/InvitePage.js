import React, { Suspense, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Preloader from '../sharedComponents/Preloader';
import setGlobalLoader from '../../redux/actions/dashboardLoaderActions';
import { getReferrerName } from '../../redux/actions/userActions'

const ProductRazorpay = React.lazy(() => import('../sharedComponents/ProductRazorpay'));

export default function InvitePage() {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [name, setName] = useState('')

    useEffect(() => {
        // setup introducer reference in cookie for 3 days
        if (searchParams.get('referer') !== null) {

            if (Cookies.get('referer') === 'null' ||
                Cookies.get('referer') === null ||
                Cookies.get('referer') === undefined
            ) {
                Cookies.set('referer', searchParams.get('referer'), {
                    expires: 3,
                });
            }

            setGlobalLoader(true);
            dispatch(getReferrerName(searchParams.get('referer')))
                .then((res) => {
                    if (res.status === 200) {
                        setGlobalLoader(false);
                        setName(res.data.name)
                    }
                }).catch((err) => {
                    console.error(err)
                    setGlobalLoader(false);
                })
        }
    }, [searchParams.get('referer')])

    return (
        <Suspense fallback={Preloader}>
            <>
                {/* <Preloader /> */}
                {/* <Navbar /> */}
                {/* <!--page-title area start--> */}

                {/* <!--page-title area end--> */}

                {/* <!-- Pricing area Start --> */}
                <div className="Pricing-area partner-page-area pd-top-150 pd-bottom-120">
                    <div className="container">
                        {name && name !== '' &&
                            <h5 style={{textAlign : 'center', marginBottom : '25px'}}>
                                You have been invited to Success Thinks by 
                                <span style={{ color: 'red', textTransform: 'capitalize', marginLeft: '5px' }}>
                                    {name}
                                </span>.
                            </h5>
                        }
                        <div className="row justify-content-center">
                            <ProductRazorpay
                                image="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1650883784/7_mfuaq8.png"
                                varClass="col-lg-5 col-md-6"
                                productName="Success Kit"
                                productPrice="4999"
                                validPoints={[]}
                                invalidPoints={[]}
                                productId="1"
                            />

                            <ProductRazorpay
                                image="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1651574841/1651563051_1_crbkx0.png"
                                varClass="col-lg-5 col-md-6"
                                productName="Mini Success Kit"
                                productPrice="2499"
                                validPoints={[]}
                                invalidPoints={[]}
                                productId="2"
                            />
                        </div>
                    </div>
                </div>
                {/* <!-- Pricing area End --> */}
                {/* <Footer /> */}
            </>
        </Suspense>
    );
}
