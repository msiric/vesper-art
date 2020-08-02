import React, { useState } from 'react';
import MUIDataTable from 'mui-datatables';
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from '@material-ui/core';

const Datatable = ({ data }) => {
  const [responsive, setResponsive] = useState('vertical');
  const [tableBodyHeight, setTableBodyHeight] = useState('100%');
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState('');

  const columns = [
    'Cover',
    'Title',
    'Availability',
    'Type',
    'Personal license',
    'Commercial license',
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
  };

  console.log(data);

  /*   const data = [
    ['Gabby George', 'Business Analyst', 'Minneapolis'],
    [
      'Aiden Lloyd',
      "Business Consultant for an International Company and CEO of Tony's Burger Palace",
      'Dallas',
    ],
    ['Jaden Collins', 'Attorney', 'Santa Ana'],
    ['Franky Rees', 'Business Analyst', 'St. Petersburg'],
    ['Aaren Rose', null, 'Toledo'],
    ['Johnny Jones', 'Business Analyst', 'St. Petersburg'],
    ['Jimmy Johns', 'Business Analyst', 'Baltimore'],
    ['Jack Jackson', 'Business Analyst', 'El Paso'],
    ['Joe Jones', 'Computer Programmer', 'El Paso'],
    ['Jacky Jackson', 'Business Consultant', 'Baltimore'],
    ['Jo Jo', 'Software Developer', 'Washington DC'],
    ['Donna Marie', 'Business Manager', 'Annapolis'],
  ];
 */
  return (
    <MUIDataTable
      title={'My artwork'}
      data={data.map((item) => [
        item.current.cover,
        item.current.title,
        item.current.availability,
        item.current.type,
        item.current.personal,
        item.current.commercial,
      ])}
      columns={columns}
      options={options}
    />
  );
};

export default Datatable;
