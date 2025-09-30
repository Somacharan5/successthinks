import React from 'react';

export default function FiguresBox({
  boxClass = 'col-sm-6 col-xl-4',
  // iconClass,
  number,
  text,
  type = null,
}) {
  return (
    <div className={boxClass} >
      <div className="card card-body abcpih" style={{ background: 'linear-gradient(to right, #003399 0%, #0052D8 100%)', boxShadow: '5px 5px 5px gray' }} >
        <div style={{ borderBottom: '1px solid white' }}>
          <span className="text-uppercase font-size-sm text-white">
            {text}
          </span>

        </div>
        <div className="media justify-content-between">
          <div >
            {type ?
              <img src='https://res.cloudinary.com/dtqrvcvp8/image/upload/v1671362526/n9jn7ezpujcqcsdsdkgg.png' alt="User" width='50px' />
              :
              <img className='figures-box-sign' src='https://res.cloudinary.com/dtqrvcvp8/image/upload/v1661328254/hg239vblcvl34sjv7jq3.png' alt="rupee sign" />
            }
          </div>

          <div className="media-body text-right">
            {type ?
              <h3 className="font-weight-semibold mb-0 text-white figure-box-money">{( number && number > 0 ) ? number : 'Your rank is yet to be determined.'}</h3> :
              <h3 className="font-weight-semibold mb-0 text-white figure-box-money">Rs. {number}</h3>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
