import React from 'react';
import { ColorRing } from "react-loader-spinner";
function Loadar() {
    return (<ColorRing
        visible={true}
        height="30"
        width="30"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#9651dc','#9651dc','#9651dc','#9651dc','#9651dc']}
    />);
}

export default Loadar;