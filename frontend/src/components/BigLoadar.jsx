import React from 'react';
import { ColorRing } from "react-loader-spinner";
function BigLoadar() {
    return (
        <div className='m-auto'>
            <ColorRing
                visible={true}
                height="100"
                width="100"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#9651dc', '#9651dc', '#9651dc', '#9651dc', '#9651dc']}
            />
        </div>);
}

export default BigLoadar;