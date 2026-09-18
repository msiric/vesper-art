import { useQueryParam } from "@hooks/useQueryParam";
import { Add as AddIcon } from "@material-ui/icons";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import IconButton from "../../domain/IconButton";
import Tooltip from "../../domain/Tooltip";
import EmptySection from "../EmptySection/index";

const DEFAULT_PAGE = 0;
const DEFAULT_ROWS = 10;
const DEFAULT_ROWS_OPTIONS = [10, 25, 100];

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
  rowsPerPage,
  pagination,
  addOptions,
  height,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(page ?? DEFAULT_PAGE);
  const [currentRows, setCurrentRows] = useState(rowsPerPage ?? DEFAULT_ROWS);
  const [displayedData, setDisplayedData] = useState([null]);
  const [responsive, setResponsive] = useState("simple");
  const [tableBodyHeight] = useState("100%");
  const [tableBodyMaxHeight] = useState("");

  const allowedPages = useMemo(
    () => Array.from(Array(Math.ceil(data.length / currentRows)).keys()),
    [data.length, currentRows]
  );

  useQueryParam("page", currentPage, DEFAULT_PAGE, allowedPages, (value) =>
    setCurrentPage(parseInt(value))
  );

  useQueryParam(
    "rows",
    currentRows,
    DEFAULT_ROWS,
    DEFAULT_ROWS_OPTIONS,
    (value) => setCurrentRows(parseInt(value))
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
    rowsPerPage: currentRows,
    rowsPerPageOptions: DEFAULT_ROWS_OPTIONS,
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
    onChangeRowsPerPage: (rows) => {
      setCurrentPage(0);
      setCurrentRows(rows);
    },
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
