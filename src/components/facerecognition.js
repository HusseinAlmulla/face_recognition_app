import React from 'react';
import '../styles/facerecongnition.css';

const FaceRecognition = ({ imageUrl, box}) => {
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputimage' alt='' src={ imageUrl } width='500px' height='auto' />
				<div className='bounding-box' 
				style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
				<div className='backg'>eeeeeeeeeeeeeeeeeeee</div>
			</div>
		</div>
	);
}

export default FaceRecognition;