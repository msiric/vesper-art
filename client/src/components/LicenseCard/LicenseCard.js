import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { formatDate } from '../../../../common/helpers.js';
import Datatable from '../../components/Datatable/Datatable.js';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const LicenseCard = ({ license }) => {
  const classes = useStyles();

  return (
    <Datatable
      title="License information"
      columns={[
        {
          name: 'Id',
          options: {
            display: false,
          },
        },
        'Fingerprint',
        'Type',
        'Assignee',
        'Price',
        'Date',
      ]}
      data={[
        [
          license._id,
          license.fingerprint,
          license.type,
          license.assignee,
          license.price || 'Free',
          formatDate(license.created, 'dd/MM/yy HH:mm'),
        ],
      ]}
      empty=""
      loading={false}
      redirect=""
      selectable={false}
      searchable={false}
      pagination={false}
      addOptions={{ enabled: false, title: '', route: '' }}
      editOptions={{
        enabled: false,
        title: '',
        route: '',
      }}
      deleteOptions={{
        enabled: false,
        title: '',
        route: '',
      }}
    />
  );
};

export default LicenseCard;
