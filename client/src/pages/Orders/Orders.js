import _ from "lodash";
import {
  Grid,
  CircularProgress,
  Paper,
  Button,
  Link,
  Icon,
  Typography,
  Input,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { format } from "date-fns";
import Datatable from "../../components/Datatable/Datatable.js";
import { getOrders } from "../../services/orders.js";

const Orders = () => {
  const [state, setState] = useState({
    loading: true,
    orders: [],
    display: "purchases",
  });
  const classes = {};

  const history = useHistory();

  const fetchOrders = async () => {
    try {
      const { data } = await getOrders({ display: state.display });
      setState({
        ...state,
        loading: false,
        orders: data[state.display],
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [state.display]);

  const handleSelectChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      display: e.target.value,
    }));
  };

  function handleRowClick(id) {
    history.push(`/orders/${id}`);
  }

  return (
    <Datatable
      title="My orders"
      columns={[
        {
          name: "Id",
          options: {
            display: false,
          },
        },
        {
          name: "Cover",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => (
              <img style={{ width: "85%", maxWidth: 200 }} src={value} />
            ),
          },
        },
        "Title",
        "Availability",
        "Type",
        "Personal license",
        "Commercial license",
      ]}
      data={state.orders.map((order) => [
        order._id,
        order.current.cover,
        order.current.title,
        order.current.availability,
        order.current.type,
        order.current.personal,
        order.current.commercial,
      ])}
      empty="You have no orders"
      addOptions={{ enabled: false, title: "", route: "" }}
      editOptions={{
        enabled: false,
        title: "",
        route: "",
      }}
      deleteOptions={{
        enabled: false,
        title: "",
        route: "",
      }}
    />
  );
};

export default withRouter(Orders);
