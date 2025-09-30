import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import DashboardHeader from './shared/DashboardHeader';
import DashboardSidebar from './shared/DashboardSidebar';
import LeaderCard from './shared/LeaderCard'
import { getLeaderboardDetails } from '../../redux/actions/userActions'
import setGlobalLoader from '../../redux/actions/dashboardLoaderActions';

export default function LeaderBoard() {
    const dispatch = useDispatch();
    const [userList, setUserList] = useState([])
    const [rank, setRank] = useState(0);

    useEffect(() => {
        setGlobalLoader(true)
        dispatch(getLeaderboardDetails()).then((response) => {
            if (response.status === 200) {
                setUserList(response.data.list.sort((a, b) => a.rank > b.rank ? 1 : -1))
                setRank(response.data.currentUserRank.rank)
                setGlobalLoader(false)
            }
        }).catch((error) => {
            console.log(error)
            toast.error('some error occured while getting leaderboard details')
            setGlobalLoader(false)
        })
    }, [])

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
                                        <span className="font-weight-semibold">
                                            Leader Board
                                        </span>
                                    </h4>
                                    <h4>
                                        <span className="font-weight-semibold text-danger">
                                            {rank === 0 ? 'You are not ranked yet' :
                                                `Your Rank : ${rank}`}
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        {/* <!-- /page header --> */}
                        {/* <!-- Content area --> */}
                        <div className="content">
                            <div className="row">
                                {userList?.map((user) => (
                                    <LeaderCard user={user} />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
