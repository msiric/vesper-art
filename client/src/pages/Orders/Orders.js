import { Container, Grid, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
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
    <Container fixed>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="data-display">Displayed data</InputLabel>
            <Select
              labelId="data-display"
              value={state.display}
              onChange={handleSelectChange}
              label="Displayed data"
              margin="dense"
            >
              <MenuItem value="purchases">Purchases</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
            </Select>
          </FormControl>
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
                name: "Artwork",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => (
                    <img style={{ width: "85%", maxWidth: 200 }} src={value} />
                  ),
                  sort: false,
                },
              },
              {
                name: "Title",
                options: {
                  sortCompare: (order) => {
                    return (obj1, obj2) =>
                      obj1.data.localeCompare(obj2.data, "en", {
                        numeric: true,
                      }) * (order === "asc" ? 1 : -1);
                  },
                },
              },
              {
                name: state.display === "purchases" ? "Seller" : "Buyer",
                options: {
                  sortCompare: (order) => {
                    return (obj1, obj2) =>
                      obj1.data.localeCompare(obj2.data, "en", {
                        numeric: true,
                      }) * (order === "asc" ? 1 : -1);
                  },
                },
              },
              {
                name: "Amount",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) =>
                    value ? `$${value}` : "Free",
                  sortCompare: (order) => {
                    return ({ data: previous }, { data: next }) => {
                      return (previous - next) * (order === "asc" ? 1 : -1);
                    };
                  },
                },
              },
              {
                name: "Rating",
                options: {
                  customBodyRender: (value) =>
                    value ? (
                      <Rating value={value.rating} readOnly />
                    ) : (
                      "Not rated"
                    ),
                  sortCompare: (order) => {
                    return ({ data: previous }, { data: next }) => {
                      return (
                        ((previous ? previous.rating : 0) -
                          (next ? next.rating : 0)) *
                        (order === "asc" ? 1 : -1)
                      );
                    };
                  },
                },
              },
              {
                name: "Date",
                options: {
                  customBodyRender: (value) =>
                    formatDate(value, "dd/MM/yy HH:mm"),
                  sortCompare: (order) => {
                    return ({ data: previous }, { data: next }) => {
                      console.log(previous);
                      return (
                        (new Date(previous).getTime() -
                          new Date(next).getTime()) *
                        (order === "asc" ? 1 : -1)
                      );
                    };
                  },
                },
              },
              ,
            ]}
            data={state.orders.map((order) => [
              order._id,
              order.version.cover,
              order.version.title,
              state.display === "purchases"
                ? order.seller.name
                : order.buyer.name,
              state.display === "purchases" ? order.spent : order.earned,
              order.review,
              order.created,
            ])}
            empty="You have no orders"
            loading={state.loading}
            redirect="orders"
            selectable={false}
            searchable={true}
            pagination={true}
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default withRouter(Orders);
