import React, { useState } from 'react';
import $ from 'jquery';
import DashboardHeader from './shared/DashboardHeader';
import DashboardSidebar from './shared/DashboardSidebar';
import SecondarySidebar from './shared/SecondarySidebar';

export default function Videos() {
  const [currentVideo, setCurrentVideo] = useState({
    title: 'Welcome to Success Thinks',
    link: 'https://www.youtube.com/embed/R88165izFvk',
  });

  const showVideos = () => {
    const mobileVideosArea = $('#sidebar-mobile-videos-menu');
    mobileVideosArea.addClass('sidebar-mobile-expanded');
  };

  const isVideoPage = window.location.href.includes('video');

  return (
    <>
      <DashboardHeader />
      <div className="page-content">
        <DashboardSidebar />
        {/* <!-- Main content --> */}
        <div className="content-wrapper">
          {/* <!-- Inner content --> */}
          <div className="content-inner">
            <div className="page-header page-header-light">
              <div className="page-header-content header-elements-lg-inline">
                <div className="page-title d-flex">
                  <h4>
                    <span className="font-weight-semibold">
                      {currentVideo?.title}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-5">
              <iframe
                title="video player"
                width="560"
                height="315"
                src={currentVideo?.link}
                allowFullScreen
              />
            </div>

            {/* <!-- /page header --> */}
          </div>
        </div>
        <SecondarySidebar setCurrentVideo={setCurrentVideo} />
      </div>
      {isVideoPage && (
        <button
          id='more-videos-button'
          type="button"
          className="navbar-toggler sidebar-mobile-right-toggle"
          onClick={() => showVideos()}
        >
          <i className="icon-video-camera3 mr-1"  />
          More Videos
        </button>
      )}
    </>
  );
}
