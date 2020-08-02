import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import DatatableHeaderTest from './DatatableHeaderTest.js';
import DatatableTest from './DatatableTest.js';
import { getGallery } from '../../services/artwork.js';

function Products() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState({});
  const [page, setPage] = useState(0);

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelected = {};
      for (let item of data) {
        newSelected[item._id] = true;
      }
      setSelected(newSelected);
    } else {
      setSelected({});
    }
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  const fetchArtwork = async () => {
    try {
      const { data } = await getGallery({
        dataCursor: 0,
        dataCeiling: 50,
      });
      setData(data.artwork);
    } catch (err) {}
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  return [
    <DatatableHeaderTest
      search={search}
      setSearch={setSearch}
      data={
        search.length
          ? _.filter(data, (item) =>
              item.current.title.toLowerCase().includes(search.toLowerCase())
            )
          : data
      }
      selected={selected}
      handleSelectAllClick={handleSelectAllClick}
      setSelected={setSelected}
      page={page}
      handleChangePage={handleChangePage}
    />,
    <DatatableTest
      search={search}
      setSearch={setSearch}
      data={
        search.length
          ? _.filter(data, (item) =>
              item.current.title.toLowerCase().includes(search.toLowerCase())
            )
          : data
      }
      selected={selected}
      handleSelectAllClick={handleSelectAllClick}
      setSelected={setSelected}
      page={page}
      handleChangePage={handleChangePage}
    />,
  ];
}

export default Products;
