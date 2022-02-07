import { Add as AddIcon } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import EmptySection from "../../components/EmptySection/index";
import IconButton from "../../domain/IconButton";
import Tooltip from "../../domain/Tooltip";
import globalStyles from "../../styles/global";
import LoadingSpinner from "../LoadingSpinner";
import dataTableStyles from "./styles";

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
  label,
  loading,
  redirect,
  selectable,
  hoverable,
  searchable,
  pagination,
  addOptions,
  height,
  className,
}) => {
  const [displayedData, setDisplayedData] = useState([null]);
  const [responsive, setResponsive] = useState("simple");
  const [tableBodyHeight, setTableBodyHeight] = useState("100%");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");

  const globalClasses = globalStyles({ hoverable });
  const classes = dataTableStyles();

  const history = useHistory();

  useEffect(() => {
    setResponsive(data.length && displayedData.length ? "vertical" : "simple");
  }, [data.length, displayedData.length]);

  const options = {
    filter: false,
    print: false,
    download: false,
    viewColumns: false,
    filterType: "dropdown",
    selectableRows: selectable,
    rowHover: hoverable,
    search: searchable,
    pagination,
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    customToolbar: () => <CustomToolbar addOptions={addOptions} />,
    onRowClick: (data) => redirect && history.push(`/${redirect}/${data[0]}`),
    onTableChange: (_, data) =>
      data.displayData.length !== displayedData.length &&
      setDisplayedData(data.displayData),
    textLabels: {
      body: {
        noMatch: loading ? (
          <LoadingSpinner height={height} label="" />
        ) : (
          <EmptySection label={label} />
        ),
      },
    },
    setTableProps: () => ({ className }),
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
