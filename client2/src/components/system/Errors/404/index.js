import React from 'react'
import { Link } from 'react-router-dom'

class Error404 extends React.Component {
  render() {
    return (
      <div className="p-5 font-size-30">
        <div className="font-weight-bold mb-3">Page not found</div>
        <div>This page is deprecated, deleted, or does not exist at all</div>
        <div className="font-weight-bold font-size-70 mb-1">404 —</div>
        <Link to="/" className="btn btn-outline-primary width-100">
          Go Back
        </Link>
      </div>
    )
  }
}

export default Error404
