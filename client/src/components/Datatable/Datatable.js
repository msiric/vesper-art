import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

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

  const classes = {};

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

const Datatable = ({
  title,
  columns,
  data,
  empty,
  redirect,
  addOptions,
  editOptions,
  deleteOptions,
}) => {
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("100%");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");

  const history = useHistory();

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    filterType: "dropdown",
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
    onRowClick: (data) => history.push(`/${redirect}/${data[0]}`),
    textLabels: {
      body: {
        noMatch: empty,
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

export default Datatable;
