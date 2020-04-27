const formatDate = (date, format) => {
  if (date) {
    const newDate = new Date(date);
    let dd = newDate.getDate();
    let mm = newDate.getMonth() + 1;
    const yyyy = newDate.getFullYear();

    const months = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Apr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec',
    };

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    if (format === 'full') return `${dd}/${mm}/${yyyy}`;
    if (format === 'month') return `${months[mm]}, ${yyyy}`;
  } else {
    return date;
  }
};

export default formatDate;
