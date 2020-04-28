import React from 'react';

const FaceRecognition = ({ imageURL }) => {
    return(
        <div className='center'>
            <img alt='' src={imageURL}></img>
        </div>
    );
}

export default FaceRecognition;