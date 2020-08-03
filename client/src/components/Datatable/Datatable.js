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

const CustomToolbar = () => {
  const history = useHistory();

  const handleAdd = () => {
    history.push("/add_artwork");
  };

  return (
    <Tooltip title="Add artwork">
      <IconButton onClick={handleAdd}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
};

const CustomToolbarSelect = ({ selectedRows, displayData }) => {
  const history = useHistory();

  const handleEdit = () => {
    history.push(
      `/edit_artwork/${
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
      {selectedRows.data.length === 1 && (
        <Tooltip title={"Edit artwork"}>
          <IconButton className={classes.iconButton} onClick={handleEdit}>
            <EditIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title={"Delete artwork"}>
        <IconButton className={classes.iconButton} onClick={handleDelete}>
          <DeleteIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const Datatable = ({ columns, data }) => {
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("100%");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    customToolbar: () => <CustomToolbar />,
    customToolbarSelect: (selectedRows, displayData) => (
      <CustomToolbarSelect
        selectedRows={selectedRows}
        displayData={displayData}
      />
    ),
  };

  return (
    <MUIDataTable
      title={"My artwork"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default Datatable;
