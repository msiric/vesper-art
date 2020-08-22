import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Paper,
  Button,
  Typography,
  Input,
  Container,
  Grid,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withRouter, useHistory } from 'react-router-dom';
import Datatable from '../../components/Datatable/Datatable.js';
import { getGallery } from '../../services/artwork.js';
import MainHeading from '../../components/MainHeading/MainHeading.js';

function ProductsTable() {
  const [state, setState] = useState({
    loading: true,
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
    <Container fixed>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Datatable
            title="My artwork"
            columns={[
              {
                name: 'Id',
                options: {
                  display: false,
                },
              },
              {
                name: 'Cover',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => (
                    <img style={{ width: '85%', maxWidth: 200 }} src={value} />
                  ),
                },
              },
              'Title',
              'Availability',
              'Type',
              'Personal license',
              'Commercial license',
            ]}
            data={state.artwork.map((artwork) => [
              artwork._id,
              artwork.current.cover,
              artwork.current.title,
              artwork.current.availability,
              artwork.current.type,
              artwork.current.personal,
              artwork.current.commercial,
            ])}
            empty="You have no artwork"
            loading={state.loading}
            redirect="artwork"
            selectable={true}
            addOptions={{
              enabled: true,
              title: 'Add artwork',
              route: 'add_artwork',
            }}
            editOptions={{
              enabled: true,
              title: 'Edit artwork',
              route: 'edit_artwork',
            }}
            deleteOptions={{
              enabled: true,
              title: 'Delete artwork',
              route: 'delete_artwork',
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withRouter(ProductsTable);
