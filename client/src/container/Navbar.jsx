import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import './Navbar.css';

export default function Navbar() {
    return (
    <>
        <nav className="nav">
            <Link className='site-title ' to="/">Creator Capital Index</Link>
            <ul>
                <li className='active' >
                <Button variant="light"><Link to="/">Top Trending Channels</Link></Button>{' '}
                </li>
                <li className='active'>
                <Button variant="light"><Link to="/search">Search Videos</Link></Button>{' '}
                </li>
                <li className='active'>
                <Button variant="light">{sessionStorage.getItem("username") ? (<Link to="/watchlist">Watchlist</Link>) : (<Link to="/login">Login</Link>)}</Button>{' '}
                </li>
            </ul>
        </nav>
    </>
)}

