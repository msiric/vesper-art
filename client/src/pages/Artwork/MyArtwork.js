import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Paper, Button, Typography, Input } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withRouter, useHistory } from "react-router-dom";
import Datatable from "../../components/Datatable/Datatable.js";
import { getGallery } from "../../services/artwork.js";

function ProductsTable() {
  const [state, setState] = useState({
    loading: false,
    artwork: [],
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 20,
  });

  const history = useHistory();

  const fetchArtwork = async () => {
    try {
      const { data } = await getGallery({
        dataCursor: state.dataCursor,
        dataCeiling: state.dataCeiling,
      });
      setState({
        ...state,
        loading: false,
        artwork: data.artwork,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  function handleRowClick(id) {
    history.push(`/artwork/${id}`);
  }

  return (
    <Datatable
      columns={[
        {
          name: "Cover",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => (
              <img src={value} />
            ),
          },
        },
        "Title",
        "Availability",
        "Type",
        "Personal license",
        "Commercial license",
      ]}
      data={state.artwork.map((artwork) => [
        artwork.current.cover,
        artwork.current.title,
        artwork.current.availability,
        artwork.current.type,
        artwork.current.personal,
        artwork.current.commercial,
      ])}
    />
  );
}

export default withRouter(ProductsTable);
