import React from 'react';
import Tilt from 'react-tilt';
import face_image from '../images/icons8-face.png';
import '../styles/Logo.css';

const Logo = ()=>{
	return (
		<div className='ma4 mt0'>
			<Tilt className='Tilt br2 shadow-2' options={{ max : 55 }} style={{ height: 100, width: 100 }} >
				<div className='tilt-logo-inner'>
					<img src={face_image} alt=''></img>
				</div>
			</Tilt>
		</div>
		
	);
}

export default Logo;
