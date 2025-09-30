/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { useSelector } from 'react-redux';

export default function SecondarySidebar({ setCurrentVideo }) {
  const navigate = useNavigate();
  const params = useParams();
  const [videos, setVideos] = useState([]);
  const videoReducer = useSelector((state) => state.videoReducer);
  const { productVideos } = videoReducer;
  const { trainingVideos } = videoReducer;

  useEffect(() => {
    /* eslint-disable no-nested-ternary */
    const videosVar = params?.product === 'training' ? trainingVideos : params?.product === 'product' ? productVideos : navigate('/dashboard');
    const filteredVideos = videosVar?.filter(d => d.category.toUpperCase().replace(/ /g, '_') === params?.category)
    setVideos(filteredVideos)
  }, [params,videoReducer ])

  return (
    // <!-- Secondary sidebar -->
    <div
      className="sidebar sidebar-light sidebar-right sidebar-expand-lg"
      id="sidebar-mobile-videos-menu"
    >
      {/* <!-- Sidebar content --> */}
      <div className="sidebar-content">
        {/* <!-- Header --> */}
        <div className="sidebar-section sidebar-section-body d-flex align-items-center">
          <h5 className="mb-0">Videos</h5>
          <div className="ml-auto">
            <button
              type="button"
              className="btn btn-outline-dark border-transparent btn-icon rounded-pill btn-sm sidebar-mobile-secondary-toggle d-lg-none"
              onClick={() =>
                $('#sidebar-mobile-videos-menu').removeClass(
                  'sidebar-mobile-expanded'
                )
              }
            >
              <i className="icon-cross2" />
            </button>
          </div>
        </div>

        <ul className="nav nav-sidebar my-2">
          {videos.map((video, index) => (
            <li className="nav-item">
              <a
                href="#"
                className="nav-link"
                onClick={() => {
                  setCurrentVideo(video);
                }}
              >
                {index + 1}.
                <i className="icon-video-camera3 ml-1" />
                {video.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
