import React from 'react'
import DashboardHeader from './shared/DashboardHeader';
import DashboardSidebar from './shared/DashboardSidebar';

function SupportPage() {
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
                                        <span className="font-weight-semibold">Support Page</span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <br />
                            <div className="d-flex flex-column ">
                                <div>
                                    <p className='support-page-details'>
                                        Phone Number :
                                    </p>
                                    <p className='support-page-details-bottom'>
                                        +91 90598 79677
                                    </p>
                                </div>
                                <div>
                                    <p className='support-page-details'>
                                        Email :
                                    </p>
                                    <p className='support-page-details-bottom'>
                                        Business@successthinks.com
                                    </p>
                                </div>
                                <div>
                                    <p className='support-page-details'>
                                        Whatsapp :
                                    </p>
                                    <a className='btn btn-danger btn-sm' href='https://wa.link/mmb8hf' target='_blank' rel="noreferrer">
                                        click here
                                    </a>
                                    <p className=' support-page-details-bottom' />
                                </div>
                                <div>
                                    <p className='support-page-details'>
                                        Join Telegram Group:
                                    </p>
                                    <a className='btn btn-danger btn-sm' href='https://t.me/+WPXWgCCHZ9w1OWM1' target='_blank' rel="noreferrer">
                                        click here
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupportPage

