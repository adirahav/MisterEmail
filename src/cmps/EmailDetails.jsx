import { utilService } from "../services/util.service";
import { emailService } from "../services/email.service";
import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { IconSizes, ArrowLeftIcon, TrashIcon, MapMarkerIcon } from '../assets/Icons';
import GoogleMapReact from 'google-map-react';

export function EmailDetails() {
    const { onDelete } = useOutletContext();
    const [email, setEmail] = useState(null);
    const [mapParams, setMapParams] = useState(null);
    const params = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        loadEmail();
    }, [params.emailId]);

    async function loadEmail() {
        try {   
            const email = await emailService.getById(params.emailId);
            setEmail(email);
        } catch (err) {
            navigate('/email');
            console.log('Had issues loading email', err);
        }
    }

    // back
    const handleBackPress = () => {
        navigate(`/email`);
    };

    // delete
    const handleDelete = () => {
        onDelete(email, true);
    }

    // map
    useEffect(() => {
        findCoordsIfExist();
    }, [email]);

    const MAP_API_KEY = 'AIzaSyCvYLSwwat03jpxCajsKKqPBiJC77HsApE';

    function findCoordsIfExist() {
        var userMapParams = null;
        if (email && email.body) {
            const pattern = /\{ lat: (\d+\.\d+), lng: (\d+\.\d+) \}/;
            const match = email.body.match(pattern);

            if (match) {
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[2]);

                if (!isNaN(lat) && !isNaN(lng)) {
                    userMapParams = {
                        center: {
                          lat: lat,
                          lng: lng
                        },
                        zoom: 15,
                        indexes: {
                            start: email.body.indexOf(match[0]),
                            end: email.body.indexOf(match[0]) + match[0].length
                        }
                    }
                }
            }
        }
        
        setMapParams(userMapParams);
    }

    const MapMarker = () => <MapMarkerIcon color="primary" sx={ IconSizes.Large } />;

    if (!email) return <div>Loading...</div>
    
    return (
        <section className="email-details">
            <article className="actions">
                <ArrowLeftIcon onClick={handleBackPress} sx={ IconSizes.Large } />
                <TrashIcon onClick={handleDelete} sx={ IconSizes.Large } />
            </article>
            <article className="subject"><h2>{email.subject}</h2></article>
            <article className="from-and-date"><div>{email.from}</div><div className="sent-at">{utilService.formatDetailsDate(email.sentAt)}</div></article>
            <article className="body">
                {!mapParams && email.body.replace(/\n/g, '\n')}
                {mapParams &&
                    <>{email.body.substring(0,mapParams.indexes.start).replace(/\n/g, '\n')}<div style={{ height: 'calc(100vh - 400px)', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: MAP_API_KEY }}
                            defaultCenter={mapParams.center}
                            defaultZoom={mapParams.zoom}>
                            <MapMarker
                                lat={mapParams.center.lat}
                                lng={mapParams.center.lng}
                            />
                        </GoogleMapReact>
                    </div>{email.body.substring(mapParams.indexes.end).replace(/\n/g, '\n')}</>
                }
            </article>
        </section>
    );
}
