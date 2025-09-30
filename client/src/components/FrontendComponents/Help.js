import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import setGlobalLoader from '../../redux/actions/dashboardLoaderActions';
import getHelpLink from '../../redux/actions/helpActions'

export default function Help() {
    const dispatch = useDispatch();
    const [link, setLink] = useState('')

    useEffect(() => {

        setGlobalLoader(true);
        dispatch(getHelpLink())
            .then((res) => {
                if (res.status === 200) {
                    setGlobalLoader(false);
                    setLink(res.data)
                }
            }).catch((err) => {
                console.error(err)
                setGlobalLoader(false);
            })
    }, [])

    return (
        <>
            <div className="container">
                {link && link !== '' &&
                    <h5 style={{ textAlign: 'center', marginTop: '25px' }}>
                        <a href={link} target="_blank" rel="noreferrer" style={{ color: 'red' }}>
                            click here
                        </a>
                    </h5>
                }
            </div>
        </>
    );
}
