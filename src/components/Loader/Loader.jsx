/* eslint-disable react/prop-types */
import {Oval} from 'react-loader-spinner'

function Loader({color, width, height}) {
  return (
    <Oval
      visible={true}
      height={!height ? "50" : height}
      width={!width ? "50" : width}
      radius="9"
      color={color ? color : "white"}
      ariaLabel="loading"
      secondaryColor={color ? color : "white"}
      wrapperStyle={{ margin: 'auto' }}
    />
  )
}

export default Loader