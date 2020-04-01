/* eslint-disable */
import React from 'react'
import { Icon } from 'antd'

class AntdIconExample extends React.Component {
  render() {
    return (
      <div>
        <h5 className="mb-3">
          <strong>Icons Usage</strong>
        </h5>
        <div className="mb-5">
          <Icon type="home" className="mr-3 mb-3 font-size-24" />
          <Icon type="setting" theme="filled" className="mr-3 mb-3 font-size-24" />
          <Icon type="smile" theme="outlined" className="mr-3 mb-3 font-size-24" />
          <Icon type="sync" spin className="mr-3 mb-3 font-size-24" />
          <Icon type="smile" rotate={180} className="mr-3 mb-3 font-size-24" />
          <Icon type="loading" className="mr-3 mb-3 font-size-24" />
        </div>
      </div>
    )
  }
}

export default AntdIconExample
