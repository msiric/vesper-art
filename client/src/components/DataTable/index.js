import { Add as AddIcon } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IconButton from "../../domain/IconButton";
import Tooltip from "../../domain/Tooltip";
import EmptySection from "../EmptySection/index";

const CustomToolbar = ({ addOptions }) => {
  const history = useHistory();

  const handleAdd = () => {
    history.push(`/${addOptions.route}`);
  };

  return (
    addOptions.enabled && (
      <Tooltip title={addOptions.title}>
        <IconButton
          aria-label="Add artwork"
          title="Add artwork"
          onClick={handleAdd}
        >
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
  const [tableBodyHeight] = useState("100%");
  const [tableBodyMaxHeight] = useState("");

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
    selectableRows: !loading && selectable,
    rowHover: !loading && hoverable,
    search: !loading && searchable,
    pagination,
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    customToolbar: () => <CustomToolbar addOptions={addOptions} />,
    onRowClick: (data) =>
      !loading && redirect && history.push(`/${redirect}/${data[0]}`),
    onTableChange: (_, data) =>
      data.displayData.length !== displayedData.length &&
      setDisplayedData(data.displayData),
    textLabels: {
      body: {
        noMatch: !loading && <EmptySection label={label} height={height} />,
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
