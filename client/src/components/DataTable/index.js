import { IconButton, Tooltip } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

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
    selectableRows: selectable,
    search: searchable,
    pagination,
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    customToolbar: () => <CustomToolbar addOptions={addOptions} />,
    onRowClick: (data) => redirect && history.push(`/${redirect}/${data[0]}`),
    textLabels: {
      body: {
        noMatch: loading ? <LoadingSpinner styles={{ padding: 154 }} /> : empty,
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
