import { IconButton, Tooltip } from '@material-ui/core';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';
import dataTableStyles from './styles';

const CustomToolbar = ({ addOptions }) => {
  const history = useHistory();

  const handleAdd = () => {
    history.push(`/${addOptions.route}`);
  };

  return (
    addOptions.enabled && (
      <Tooltip title={addOptions.title}>
        <IconButton onClick={handleAdd}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    )
  );
};

const CustomToolbarSelect = ({
  selectedRows,
  displayData,
  editOptions,
  deleteOptions,
}) => {
  const history = useHistory();
  const classes = dataTableStyles();

  const handleEdit = () => {
    history.push(
      `/${editOptions.route}/${
        displayData.find(
          (item) => item.dataIndex === selectedRows.data[0].dataIndex
        ).data[0]
      }`
    );
  };

  const handleDelete = () => {
    console.log(
      `delete artwork with dataIndexes: ${displayData
        .filter((item) =>
          selectedRows.data.find((row) => item.dataIndex === row.dataIndex)
        )
        .map((element) => element.data[0])}`
    );
  };

  return (
    <div className={classes.iconContainer}>
      {editOptions.enabled && selectedRows.data.length === 1 && (
        <Tooltip title={editOptions.title}>
          <IconButton className={classes.iconButton} onClick={handleEdit}>
            <EditIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}
      {deleteOptions.enabled && (
        <Tooltip title={deleteOptions.title}>
          <IconButton className={classes.iconButton} onClick={handleDelete}>
            <DeleteIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

const DataTable = ({
  title,
  columns,
  data,
  empty,
  loading,
  redirect,
  selectable,
  searchable,
  pagination,
  addOptions,
  editOptions,
  deleteOptions,
}) => {
  const [responsive, setResponsive] = useState('vertical');
  const [tableBodyHeight, setTableBodyHeight] = useState('100%');
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState('');

  const history = useHistory();

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    filterType: 'dropdown',
    selectableRows: selectable,
    search: searchable,
    pagination,
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    customToolbar: () => <CustomToolbar addOptions={addOptions} />,
    customToolbarSelect: (selectedRows, displayData) => (
      <CustomToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
        editOptions={editOptions}
        deleteOptions={deleteOptions}
      />
    ),
    onRowClick: (data) => redirect && history.push(`/${redirect}/${data[0]}`),
    textLabels: {
      body: {
        noMatch: loading ? <LoadingSpinner padding={154} /> : empty,
      },
    },
  };

  return (
    <MUIDataTable
      title={title}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default DataTable;