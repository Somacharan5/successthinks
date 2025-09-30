/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { toast } from 'react-toastify';
import Tooltip from '@material-ui/core/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './shared/DashboardHeader';
import DashboardSidebar from './shared/DashboardSidebar';
import Table from './shared/Table';
import { getVideoTopics, deleteVideoTopic } from '../../redux/actions/videoTopicActions';
import setGlobalLoader from '../../redux/actions/dashboardLoaderActions';

export default function AllVideoTopics() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [videosTopics, setVideosTopics] = useState([]);
  const authReducer = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (authReducer?.user?.userType !== '0') {
      navigate('/dashboard');
    }
  }, [authReducer]);

  const handleDelete = async (rowData) => {
    const text = `Do you want to delete ${rowData.title} video topic?`;

    if (window.confirm(text) === true) {
      setGlobalLoader(true);
      dispatch(deleteVideoTopic(rowData.id))
        .then((res) => {
          if (res.status === 200) {
            setGlobalLoader(false);
            toast.success(res.data);
            setVideosTopics(videosTopics.filter((d) => d.id !== rowData.id))
          } else {
            toast.error('Some error occured while fetching this video topics.');
          }
        })
        .catch((error) => {
          console.log(error);
          setGlobalLoader(false);
          toast.error('some error occured while deleting the video topic');
        });

    } else {
      toast.success('Deletion request cancelled.');
    }
  };

  const columns = [
    { title: 'Title', field: 'title', filtering: false },
    { title: 'Key', field: 'key', filtering: false },
    {
      title: 'Actions',
      field: '',
      filtering: false,
      render: (rowData) => (
        <div className="tableActions ">
          <Tooltip title="Delete Video">
            <i
              className="icon-trash ml-2 text-danger"
              role="button"
              onClick={() => handleDelete(rowData)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setGlobalLoader(true);
    dispatch(getVideoTopics())
      .then((res) => {
        if (res.status === 200) {
          setGlobalLoader(false);
          const data = res.data.map(d => ({
            // eslint-disable-next-line no-underscore-dangle
            id: d?._id,
            title: d?.title,
            key: d?.key,
          }))
          setVideosTopics(data)
        } else {
          toast.error('Some error occured while fetching this video topics.');
        }
      })
      .catch((error) => {
        console.log(error);
        setGlobalLoader(false);
        toast.error(error.response.data.errors[0].msg);
      });
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
                <div className="page-title d-flex">
                  <h4>
                    <span className="font-weight-semibold">Video Topics</span>
                  </h4>
                </div>
              </div>
            </div>
            {/* <!-- /page header --> */}

            {/* <!-- Basic layout--> */}
            <div className="content">
              <Table
                columns={columns}
                data={videosTopics}
                export={false}
                // search
                selection={false}
                toolbar
                title="Videos Topics"
              />
            </div>

            {/* <!-- /basic layout --> */}
          </div>
        </div>
      </div>
    </>
  );
}
