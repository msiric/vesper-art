import React from 'react'
import { Table, Icon, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
import table from './data.json'

class EcommerceOrders extends React.Component {
  state = {
    tableData: table.data,
    data: table.data,
    filterDropdownVisible: false,
    searchText: '',
    filtered: false,
  }

  onInputChange = e => {
    this.setState({ searchText: e.target.value })
  }

  onSearch = () => {
    const { searchText, tableData } = this.state
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData
        .map(record => {
          const match = record.customer.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
            name: (
              <span>
                {record.customer
                  .split(reg)
                  .map((text, i) =>
                    i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text,
                  )}
              </span>
            ),
          }
        })
        .filter(record => !!record),
    })
  }

  refSearchInput = node => {
    this.searchInput = node
  }

  render() {
    const { data, searchText, filterDropdownVisible, filtered } = this.state

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: text => (
          <a className="btn btn-sm btn-light" href="#" onClick={e => e.preventDefault()}>
            {text}
          </a>
        ),
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: 'Purchase Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        sorter: (a, b) => a.name.length - b.name.length,
        render: text => (
          <a className="btn btn-sm btn-light" href="#" onClick={e => e.preventDefault()}>
            {text}
          </a>
        ),
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={searchText}
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Grand Total',
        dataIndex: 'total',
        key: 'total',
        render: text => <span>{`$${text}`}</span>,
        sorter: (a, b) => a.total - b.total,
      },
      {
        title: 'Tax',
        dataIndex: 'tax',
        key: 'tax',
        render: text => <span>{`$${text}`}</span>,
        sorter: (a, b) => a.tax - b.tax,
      },
      {
        title: 'Shipping',
        dataIndex: 'shipping',
        key: 'shipping',
        render: text => <span>{`$${text}`}</span>,
        sorter: (a, b) => a.shipping - b.shipping,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => (
          <span
            className={
              text === 'Processing'
                ? 'font-size-12 badge badge-primary'
                : 'font-size-12 badge badge-default'
            }
          >
            {text}
          </span>
        ),
        sorter: (a, b) => a.status.length - b.status.length,
      },
      {
        title: 'Action',
        key: 'action',
        render: () => (
          <span>
            <a href="#" onClick={e => e.preventDefault()} className="btn btn-sm btn-light mr-2">
              <i className="fe fe-edit mr-2" />
              View
            </a>
            <a href="#" onClick={e => e.preventDefault()} className="btn btn-sm btn-light">
              <small>
                <i className="fe fe-trash mr-2" />
              </small>
              Remove
            </a>
          </span>
        ),
      },
    ]

    return (
      <div>
        <Helmet title="Ecommerce: Orders" />
        <div className="cui__utils__heading">
          <strong>Ecommerce: Orders</strong>
        </div>
        <div className="card">
          <div className="card-header card-header-flex">
            <div className="d-flex flex-column justify-content-center mr-auto">
              <h5 className="mb-0">Latest Orders</h5>
            </div>
            <div className="d-flex flex-column justify-content-center">
              <a className="btn btn-primary" href="#" onClick={e => e.preventDefault()}>
                New Order
              </a>
            </div>
          </div>
          <div className="card-body">
            <div className="text-nowrap">
              <Table
                scroll={{ x: true }}
                columns={columns}
                dataSource={data}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EcommerceOrders
