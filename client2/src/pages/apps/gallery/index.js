import React from 'react'
import { Helmet } from 'react-helmet'
import { Checkbox, Button, Icon } from 'antd'
import data from './data.json'
import style from './style.module.scss'

class AppsGallery extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Gallery" />
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-wrap mb-4">
              <Checkbox>Models</Checkbox>
              <Checkbox>Fashion</Checkbox>
              <Checkbox>Cars</Checkbox>
              <Checkbox checked>Wallpapers</Checkbox>
            </div>
            <div className={style.items}>
              {data.map(item => (
                <div key={Math.random()} className={style.item}>
                  <div className={style.itemContent}>
                    <div className={style.itemControl}>
                      <div className={style.itemControlContainer}>
                        <Button.Group size="default">
                          <Button>
                            <Icon type="edit" />
                          </Button>
                          <Button>
                            <Icon type="delete" />
                          </Button>
                        </Button.Group>
                      </div>
                    </div>
                    <img src={item.path} alt="Gallery" />
                  </div>
                  <div className="text-gray-6">
                    <div>{item.name}</div>
                    <div>{item.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AppsGallery
