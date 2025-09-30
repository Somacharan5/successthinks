import React from 'react';

export default function LeaderCard({ user }) {
    const profileImage = user?.profile_image
    const { name, rank, activeIncome, passiveIncome } = user;
    return (
        <div className="col-12">
            <div className="card card-body">
                <div className="media">
                    <div className="mr-3">
                        <img src=
                            {profileImage && profileImage.length > 0 ? profileImage :
                                "https://res.cloudinary.com/dtqrvcvp8/image/upload/v1652010949/w1brnxd9vrid1d21fbi6.jpg"
                            }
                            className="rounded-circle" width="42" height="42" alt="" />
                    </div>

                    <div className="media-body">
                        <h6 className="mb-0">{name}</h6>
                        <span className=" text-danger">Rank : {rank}</span>
                    </div>

                    <div className="ml-3 align-self-center">
                        <div className="list-icons" />
                        <span>Rs {activeIncome + passiveIncome}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
