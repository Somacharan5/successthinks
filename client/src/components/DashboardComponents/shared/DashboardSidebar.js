/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import $ from 'jquery';
import { toast } from 'react-toastify';
import Tooltip from '@material-ui/core/Tooltip';
import { Link, useNavigate } from 'react-router-dom';
import CopyToClipBoardIconButton from './CopyToClipBoardIconButton';
import Popup from './Popup';
import Button from './Button';
import certificateImage from '../../../utils/certificateBase64'
import setAuthToken from '../../../utils/setAuthToken';
import { editUserImage } from '../../../redux/actions/userActions';
import { getVideos, loadTrainingVideos, loadProductVideos } from '../../../redux/actions/videoActions';
import setGlobalLoader from '../../../redux/actions/dashboardLoaderActions';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const removeDuplicatesCategory = (array) => {
  const arrayVar = [];
  for (let i = 0; i < array.length; i++) {
    if (!arrayVar.includes(array[i].category))
      arrayVar.push(array[i].category);
  }
  const arrayReturn = arrayVar.map(category => ({ label: category, key: category.toUpperCase().replace(/ /g, '_') }))
  return arrayReturn;
}

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [productVideosCategories, setProductVideosCategories] = useState([]);
  const [trainingVideosCategories, setTrainingVideosCategories] = useState([]);
  const [successKitMenu, setSuccessKitMenu] = useState(false);
  const [successKitMiniMenu, setSuccessKitMiniMenu] = useState(false);
  const [trainingVideosMenu, setTrainingVideosMenu] = useState(false);
  const [affiliateDashboard, setAffiliateDashboard] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const authReducer = useSelector((state) => state.authReducer);
  const isSuccessKit = authReducer?.user?.products?.includes('1');
  const isSuccessKitMini = authReducer?.user?.products?.includes('2');
  const isUser = authReducer?.user?.userType?.includes('2');
  const isAdmin = authReducer?.user?.userType?.includes('0');
  const productId = authReducer?.user?.products.includes('1') ? '1' : '2';

  const checkProducts = (values) => {
    if (values.includes('1')) {
      return 'Success Kit'
    }
    return 'Mini Success Kit'
  }

  const downloadCertificates = (values) => {

    const name = values.split(' ')
    const capitalizeNameArray = name.map(n => n.charAt(0).toUpperCase() + n.substr(1))
    const capitalizeName = capitalizeNameArray.join(' ')

    const docDefinition = {
      pageSize: 'A5',
      pageOrientation: 'landscape',
      pageMargins: [0, 0, 0, 0],
      info: {
        title: 'Success thinks pro certificate',
        author: 'Success thinks',
        subject: 'Pro Certificate',
      },
      content: [
        {
          image: certificateImage,
          width: '595',
        },
        {
          text: capitalizeName,
          absolutePosition: { x: 215, y: 205 },
          fontSize: 18,
          lineHeight: 1.5,
        },
      ]
    }

    pdfMake.createPdf(docDefinition).open()
  }

  const uploadFile = () => {
    setGlobalLoader(true);
    // getting the file using useState was not working here, so used jquery
    const image = $('#profile_image_chnage').prop('files')[0];

    const formData = new FormData();
    formData.append('image', image);

    // case sensitive data
    const configHeaders = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    };

    dispatch(
      editUserImage(
        authReducer?.user?.userreference,
        formData,
        configHeaders,
        setOpenModal
      )
    );
  };

  const inputField = () => (
    <>
      <div className="d-flex justify-content-center">
        <input type="file" id="profile_image_chnage" />
      </div>
      <br />
      <div className="d-flex container col-lg-6  justify-content-around">
        <Button
          text="Submit"
          type="submit"
          className="btn btn-sm btn-primary"
          onClick={() => uploadFile()}
        />
        <Button
          text="Close"
          type="reset"
          className="btn btn-sm btn-danger"
          onClick={() => setOpenModal(false)}
        />
      </div>
    </>
  );

  useEffect(() => {
    if (!authReducer.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    } else {
      console.log('no token to send');
      return;
    }
    setModalContent(inputField);

    setGlobalLoader(true);
    dispatch(getVideos())
      .then((res) => {
        if (res.status === 200) {
          setGlobalLoader(false);
          const productVideosVar = res?.data?.filter((v) => v.products.includes(`${productId}`))
          const trainingVideosVar = res?.data?.filter((v) => v.products.includes('3'))
          dispatch(loadProductVideos(productVideosVar));
          dispatch(loadTrainingVideos(trainingVideosVar))
          setProductVideosCategories(removeDuplicatesCategory(productVideosVar))
          setTrainingVideosCategories(removeDuplicatesCategory(trainingVideosVar))
        } else {
          setGlobalLoader(false);
          toast.error(

            'Some error occured while getting videos, Please try again'
          );
        }
      })
  }, [authReducer, productId]);

  // toggle menu
  const showAffiliateDashboard = () => {
    if (affiliateDashboard === false) {
      $('#affiliateDashboardMenu').css('display', 'block');
      setAffiliateDashboard(true);
    } else {
      $('#affiliateDashboardMenu').css('display', 'none');
      setAffiliateDashboard(false);
    }
  };

  // toggle menu
  const showMenuSuccessKit = () => {
    if (successKitMenu === false) {
      $('#successKitMenu').css('display', 'block');
      setSuccessKitMenu(true);
    } else {
      $('#successKitMenu').css('display', 'none');
      setSuccessKitMenu(false);
    }
  };

  // toggle menu
  const showMenuSuccessKitMini = () => {
    if (successKitMiniMenu === false) {
      $('#successKitMiniMenu').css('display', 'block');
      setSuccessKitMiniMenu(true);
    } else {
      $('#successKitMiniMenu').css('display', 'none');
      setSuccessKitMiniMenu(false);
    }
  };

  // toggle menu
  const showTrainingVideos = () => {
    if (trainingVideosMenu === false) {
      $('#trainingVideosMenu').css('display', 'block');
      setTrainingVideosMenu(true);
    } else {
      $('#trainingVideosMenu').css('display', 'none');
      setTrainingVideosMenu(false);
    }
  };


  // $('#main-sidebar-mobile').css('height', '100vh');

  const hideMenu = () => {
    const mobileMenuArea = $('#main-sidebar-mobile');
    mobileMenuArea.removeClass('sidebar-mobile-expanded');
  };

  return (
    // <!-- Main sidebar -->
    <div
      className="sidebar sidebar-light sidebar-main sidebar-expand-lg"
      id="main-sidebar-mobile"
    >
      {/* <!-- Sidebar content --> */}
      <div className="sidebar-content">
        {/* <!-- User menu --> */}
        <div className="sidebar-section">
          <div className="sidebar-user-material">
            <div className="sidebar-section-body">
              <div className="d-flex justify-content-between">
                <div className="flex-1">
                  <button
                    type="button"
                    className="btn btn-outline-light border-transparent btn-icon btn-sm rounded-pill"
                    onClick={() => setOpenModal(true)}
                  >
                    <i className="icon-wrench" />
                  </button>
                </div>
                <img
                  src={
                    authReducer?.user?.profile_image
                      ? authReducer?.user?.profile_image
                      : 'https://res.cloudinary.com/dtqrvcvp8/image/upload/v1652010949/w1brnxd9vrid1d21fbi6.jpg'
                  }
                  className="img-fluid rounded-circle shadow-sm text-center"
                  style={{
                    height: '80px',
                    width: '80px',
                    backgroundColor: 'lightblue',
                  }}
                  alt=""
                />

                <div className="flex-1 text-right">
                  {/* <CopyToClipBoardIconButton
                    // disabled={isUser}
                    className="btn btn-outline-light border-transparent btn-icon rounded-pill btn-sm sidebar-control sidebar-main-resize d-none d-lg-inline-flex"
                    clipBoardValue={`${window.location.origin}?referer=${authReducer?.user?.userreference}`}
                  /> */}

                  <button
                    type="button"
                    className="btn btn-outline-light border-transparent btn-icon rounded-pill btn-sm sidebar-mobile-main-toggle d-lg-none"
                    onClick={() => hideMenu()}
                  >
                    <i className="icon-cross2" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h6 className="mb-0 text-white text-shadow-dark mt-3">
                  {authReducer?.user?.name}
                </h6>
                <span className="font-size-sm text-white text-shadow-dark">
                  @{authReducer?.user?.username}
                </span>
                <h6 className="font-size-sm text-danger text-shadow-dark">
                  Product - {checkProducts(authReducer?.user?.products)}
                </h6>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- /user menu --> */}

        {/* <!-- Main navigation --> */}
        <div className="sidebar-section">
          <ul className="nav nav-sidebar" data-nav-type="accordion">
            {/* <!-- Main --> */}
            <li className="nav-item-header">
              <div className="text-uppercase font-size-xs line-height-xs">
                Menu
              </div>
              <i className="icon-menu" title="Main" />
            </li>

            {isUser === false ? (
              <li className="nav-item nav-item-submenu">
                <a
                  href="#"
                  className="nav-link"
                  onClick={() => showAffiliateDashboard()}
                >
                  <i className="icon-home4" role="button" />
                  <span>Dashboard</span>
                </a>
                <ul
                  className="nav nav-group-sub"
                  data-submenu-title="Menu levels"
                  id="affiliateDashboardMenu"
                >
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                      <i className="icon-home4" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/dashboard/affiliate-dashboard"
                      className="nav-link"
                    >
                      <i className="icon-cash3" />
                      <span>Affiliate Dashboard</span>
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <i className="icon-home4" />
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/leaderboard" className="nav-link">
                <i className="icon-users" />
                <span>Leaderboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='#'>
                <CopyToClipBoardIconButton
                  // className="nav-link"
                  clipBoardValue={`${window.location.origin}/invite-page?referer=${authReducer?.user?.userreference}`}
                />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/payments" className="nav-link">
                <i className="icon-coin-dollar" />
                <span>Payments</span>
              </Link>
            </li>
            <span className="nav-item">
                <a href="#" className="nav-link">
                  <i className="icon-bag" />
                  Success Kit Prime
                  <Tooltip title="Coming Soon.">
                    <span className="badge badge-danger badge-pill ml-auto p-1">
                      <i className="icon-lock mr-2 ml-2" />
                    </span>
                  </Tooltip>
                </a>
              </span>

            {isSuccessKit || isAdmin ? (
              <li className="nav-item nav-item-submenu">
                <a
                  href="#"
                  className="nav-link"
                  onClick={() => showMenuSuccessKit()}
                >
                  <i className="icon-bag" role="button" />
                  <span>Success Kit</span>
                </a>
                <ul
                  className="nav nav-group-sub"
                  data-submenu-title="Menu levels"
                  id="successKitMenu"
                >
                  {productVideosCategories?.map(d => (
                    <li className="nav-item">
                      <Link to={`/videos/product/${d.key}`} className="nav-link">
                        <i className="icon-video-camera3" />
                        <span>{d.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <span className="nav-item">
                <a href="#" className="nav-link">
                  <i className="icon-bag" />
                  Success Kit
                  <Tooltip title="This Content is Locked for you.">
                    <span className="badge badge-danger badge-pill ml-auto p-1">
                      <i className="icon-lock mr-2 ml-2" />
                    </span>
                  </Tooltip>
                </a>
              </span>
            )}

            {isSuccessKitMini || isAdmin ? (
              <li className="nav-item nav-item-submenu">
                <a
                  href="#"
                  className="nav-link"
                  onClick={() => showMenuSuccessKitMini()}
                >
                  <i className="icon-bag" role="button" />
                  <span>Mini Success Kit</span>
                </a>
                <ul
                  className="nav nav-group-sub"
                  data-submenu-title="Menu levels"
                  id="successKitMiniMenu"
                >
                  {productVideosCategories?.map(d => (
                    <li className="nav-item">
                      <Link to={`/videos/product/${d.key}`} className="nav-link">
                        <i className="icon-video-camera3" />
                        <span>{d.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <span className="nav-item">
                <a href="#" className="nav-link">
                  <i className="icon-bag" />
                  Mini Success Kit
                  <Tooltip title="This Content is Locked for you.">
                    <span className="badge badge-danger badge-pill ml-auto p-1">
                      <i className="icon-lock mr-2 ml-2" />
                    </span>
                  </Tooltip>
                </a>
              </span>
            )}

            <li className="nav-item nav-item-submenu">
              <a
                href="#"
                // href={`/videos/training/${trainingVideosCategories[0]?.key}`}
                className="nav-link"
                onClick={() => showTrainingVideos()}
              >
                <i className="icon-bag" role="button" />
                <span>Training Videos</span>
              </a>
              <ul
                className="nav nav-group-sub"
                data-submenu-title="Menu levels"
                id="trainingVideosMenu"
              >
                {trainingVideosCategories?.map(d => (
                  <li className="nav-item">
                    <Link to={`/videos/training/${d.key}`} className="nav-link">
                      <i className="icon-video-camera3" />
                      <span>{d.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <span className="nav-item">
                <a href="#" className="nav-link">
                  <i className="icon-stats-growth" />
                  Placements
                  <Tooltip title="Coming Soon.">
                    <span className="badge badge-danger badge-pill ml-auto p-1">
                      <i className="icon-lock mr-2 ml-2" />
                    </span>
                  </Tooltip>
                </a>
              </span>
              <span className="nav-item">
                <a href="#" className="nav-link">
                  <i className="icon-user-tie" />
                  Apply for Core Team
                  <Tooltip title="Coming Soon.">
                    <span className="badge badge-danger badge-pill ml-auto p-1">
                      <i className="icon-lock mr-2 ml-2" />
                    </span>
                  </Tooltip>
                </a>
              </span>

            <li className="nav-item">
              <Link to="/support-page" className="nav-link">
                <i className="icon-info22" />
                <span>Support</span>
              </Link>
            </li>
            
            {/* {authReducer?.user?.certificate === true || isAdmin && ( */}
            {isAdmin && (
              <li className="nav-item">
                <Link to="#" className="nav-link" onClick={() => downloadCertificates(authReducer?.user?.name)}>
                  <i className="icon-file-pdf" />
                  <span>certificate</span>
                </Link>
              </li>
            )}
            {authReducer?.user?.userType === '0' && (
              <>
                <li className="nav-item">
                  <Link to="/add-user" className="nav-link">
                    <i className="icon-user-plus" />
                    <span>Add User</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/users" className="nav-link">
                    <i className="icon-users" />
                    <span>Users</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/add-video" className="nav-link">
                    <i className="icon-video-camera3" />
                    <span>Add Video</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/all-videos" className="nav-link">
                    <i className="icon-video-camera3" />
                    <span>All Videos</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/add-video-topic" className="nav-link">
                    <i className="icon-video-camera3" />
                    <span>Add Video Topic</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/all-video-topics" className="nav-link">
                    <i className="icon-video-camera3" />
                    <span>All Video Topics</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/discount-coupons" className="nav-link">
                    <i className="icon-coin-dollar" />
                    <span>Discount Coupons</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/withdrawal-requests" className="nav-link">
                    <i className="icon-link" />
                    <span>Withdrawal Requests</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/add-notifications" className="nav-link">
                    <i className="icon-bubble2" />
                    <span>Add Notifications</span>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link to="/users-income-table" className="nav-link">
                    <i className="icon-wallet" />
                    <span>User Income Table</span>
                  </Link>
                </li> */}
              </>
            )}
            {/* <!-- /main --> */}
          </ul>
        </div>
        {/* <!-- /main navigation --> */}
      </div>
      <Popup
        setOpenModal={setOpenModal}
        openModal={openModal}
        maxWidth="sm"
        Title="Update New Image"
        Content={modalContent}
      />
      {/* <!-- /sidebar content --> */}
    </div>

    // {/* <!-- /main sidebar --> */}
  );
}
