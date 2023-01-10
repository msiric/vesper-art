import { useQueryParam } from "@hooks/useQueryParam";
import { Add as AddIcon } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IconButton from "../../domain/IconButton";
import Tooltip from "../../domain/Tooltip";
import EmptySection from "../EmptySection/index";

const ROWS_PER_PAGE = 10;
const DEFAULT_PAGE = 0;

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
  page,
  pagination,
  addOptions,
  height,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(page ?? DEFAULT_PAGE);
  const [displayedData, setDisplayedData] = useState([null]);
  const [responsive, setResponsive] = useState("simple");
  const [tableBodyHeight] = useState("100%");
  const [tableBodyMaxHeight] = useState("");

  const allowedPages = Array.from(
    Array(Math.ceil(data.length / ROWS_PER_PAGE)).keys()
  );

  useQueryParam("page", currentPage, DEFAULT_PAGE, allowedPages, (value) =>
    setCurrentPage(parseInt(value))
  );

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
    page: currentPage,
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
    onChangePage: (page) => setCurrentPage(page),
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
