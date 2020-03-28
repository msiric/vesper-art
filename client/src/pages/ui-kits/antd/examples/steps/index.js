/* eslint-disable */
import React from 'react'
import { Steps, Icon } from 'antd'

const { Step } = Steps

class AntdStepsExample extends React.Component {
  render() {
    return (
      <div>
        <h5 className="mb-3">
          <strong>Basic</strong>
        </h5>
        <div className="mb-5">
          <Steps current={1}>
            <Step title="Finished" description="This is a description." />
            <Step title="In Progress" description="This is a description." />
            <Step title="Waiting" description="This is a description." />
          </Steps>
        </div>
        <h5 className="mb-3">
          <strong>With Icons</strong>
        </h5>
        <div className="mb-5">
          <Steps>
            <Step status="finish" title="Login" icon={<Icon type="user" />} />
            <Step status="finish" title="Verification" icon={<Icon type="solution" />} />
            <Step status="process" title="Pay" icon={<Icon type="loading" />} />
            <Step status="wait" title="Done" icon={<Icon type="smile" />} />
          </Steps>
        </div>
        <h5 className="mb-3">
          <strong>Centered</strong>
        </h5>
        <div className="mb-5">
          <Steps progressDot current={1}>
            <Step title="Finished" description="This is a description." />
            <Step title="In Progress" description="This is a description." />
            <Step title="Waiting" description="This is a description." />
          </Steps>
        </div>
        <h5 className="mb-3">
          <strong>Vertical</strong>
        </h5>
        <div className="mb-5">
          <Steps direction="vertical" current={1}>
            <Step title="Finished" description="This is a description." />
            <Step title="In Progress" description="This is a description." />
            <Step title="Waiting" description="This is a description." />
          </Steps>
        </div>
      </div>
    )
  }
}

export default AntdStepsExample
