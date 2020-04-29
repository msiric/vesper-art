import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
import UploadInput from '../../shared/UploadInput/UploadInput';
import * as Yup from 'yup';
import Gallery from '../Home/Gallery';
import {
  AppBar,
  Tab,
  Box,
  Tabs,
  Modal,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemSecondaryAction,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Paper,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Popover,
  Link as Anchor,
} from '@material-ui/core';
import {
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  FavoriteBorderRounded as SaveIcon,
  FavoriteRounded as SavedIcon,
  ShareRounded as ShareIcon,
  LinkRounded as CopyIcon,
} from '@material-ui/icons';
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  RedditIcon,
  TwitterIcon,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withSnackbar } from 'notistack';
import { Link, useHistory } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import formatDate from '../../utils/formatDate';
import ax from '../../axios.config';
import ProfileStyles from './Profile.style';

const userPhotoConfig = {
  size: 500 * 1024,
  format: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
};

const countries = [
  { value: '' },
  { value: 'AF', text: 'Afghanistan' },
  { value: 'AX', text: 'Åland Islands' },
  { value: 'AL', text: 'Albania' },
  { value: 'DZ', text: 'Algeria' },
  { value: 'AS', text: 'American Samoa' },
  { value: 'AD', text: 'Andorra' },
  { value: 'AO', text: 'Angola' },
  { value: 'AI', text: 'Anguilla' },
  { value: 'AQ', text: 'Antarctica' },
  { value: 'AG', text: 'Antigua and Barbuda' },
  { value: 'AR', text: 'Argentina' },
  { value: 'AM', text: 'Armenia' },
  { value: 'AW', text: 'Aruba' },
  { value: 'AU', text: 'Australia' },
  { value: 'AT', text: 'Austria' },
  { value: 'AZ', text: 'Azerbaijan' },
  { value: 'BS', text: 'Bahamas' },
  { value: 'BH', text: 'Bahrain' },
  { value: 'BD', text: 'Bangladesh' },
  { value: 'BB', text: 'Barbados' },
  { value: 'BY', text: 'Belarus' },
  { value: 'BE', text: 'Belgium' },
  { value: 'BZ', text: 'Belize' },
  { value: 'BJ', text: 'Benin' },
  { value: 'BM', text: 'Bermuda' },
  { value: 'BT', text: 'Bhutan' },
  { value: 'BO', text: 'Bolivia, Plurinational State of' },
  { value: 'BQ', text: 'Bonaire, Sint Eustatius and Saba' },
  { value: 'BA', text: 'Bosnia and Herzegovina' },
  { value: 'BW', text: 'Botswana' },
  { value: 'BV', text: 'Bouvet Island' },
  { value: 'BR', text: 'Brazil' },
  { value: 'IO', text: 'British Indian Ocean Territory' },
  { value: 'BN', text: 'Brunei Darussalam' },
  { value: 'BG', text: 'Bulgaria' },
  { value: 'BF', text: 'Burkina Faso' },
  { value: 'BI', text: 'Burundi' },
  { value: 'KH', text: 'Cambodia' },
  { value: 'CM', text: 'Cameroon' },
  { value: 'CA', text: 'Canada' },
  { value: 'CV', text: 'Cape Verde' },
  { value: 'KY', text: 'Cayman Islands' },
  { value: 'CF', text: 'Central African Republic' },
  { value: 'TD', text: 'Chad' },
  { value: 'CL', text: 'Chile' },
  { value: 'CN', text: 'China' },
  { value: 'CX', text: 'Christmas Island' },
  { value: 'CC', text: 'Cocos (Keeling) Islands' },
  { value: 'CO', text: 'Colombia' },
  { value: 'KM', text: 'Comoros' },
  { value: 'CG', text: 'Congo' },
  { value: 'CD', text: 'Congo, the Democratic Republic of the' },
  { value: 'CK', text: 'Cook Islands' },
  { value: 'CR', text: 'Costa Rica' },
  { value: 'CI', text: "Côte d'Ivoire" },
  { value: 'HR', text: 'Croatia' },
  { value: 'CU', text: 'Cuba' },
  { value: 'CW', text: 'Curaçao' },
  { value: 'CY', text: 'Cyprus' },
  { value: 'CZ', text: 'Czech Republic' },
  { value: 'DK', text: 'Denmark' },
  { value: 'DJ', text: 'Djibouti' },
  { value: 'DM', text: 'Dominica' },
  { value: 'DO', text: 'Dominican Republic' },
  { value: 'EC', text: 'Ecuador' },
  { value: 'EG', text: 'Egypt' },
  { value: 'SV', text: 'El Salvador' },
  { value: 'GQ', text: 'Equatorial Guinea' },
  { value: 'ER', text: 'Eritrea' },
  { value: 'EE', text: 'Estonia' },
  { value: 'ET', text: 'Ethiopia' },
  { value: 'FK', text: 'Falkland Islands (Malvinas)' },
  { value: 'FO', text: 'Faroe Islands' },
  { value: 'FJ', text: 'Fiji' },
  { value: 'FI', text: 'Finland' },
  { value: 'FR', text: 'France' },
  { value: 'GF', text: 'French Guiana' },
  { value: 'PF', text: 'French Polynesia' },
  { value: 'TF', text: 'French Southern Territories' },
  { value: 'GA', text: 'Gabon' },
  { value: 'GM', text: 'Gambia' },
  { value: 'GE', text: 'Georgia' },
  { value: 'DE', text: 'Germany' },
  { value: 'GH', text: 'Ghana' },
  { value: 'GI', text: 'Gibraltar' },
  { value: 'GR', text: 'Greece' },
  { value: 'GL', text: 'Greenland' },
  { value: 'GD', text: 'Grenada' },
  { value: 'GP', text: 'Guadeloupe' },
  { value: 'GU', text: 'Guam' },
  { value: 'GT', text: 'Guatemala' },
  { value: 'GG', text: 'Guernsey' },
  { value: 'GN', text: 'Guinea' },
  { value: 'GW', text: 'Guinea-Bissau' },
  { value: 'GY', text: 'Guyana' },
  { value: 'HT', text: 'Haiti' },
  { value: 'HM', text: 'Heard Island and McDonald Islands' },
  { value: 'VA', text: 'Holy See (Vatican City State)' },
  { value: 'HN', text: 'Honduras' },
  { value: 'HK', text: 'Hong Kong' },
  { value: 'HU', text: 'Hungary' },
  { value: 'IS', text: 'Iceland' },
  { value: 'IN', text: 'India' },
  { value: 'ID', text: 'Indonesia' },
  { value: 'IR', text: 'Iran, Islamic Republic of' },
  { value: 'IQ', text: 'Iraq' },
  { value: 'IE', text: 'Ireland' },
  { value: 'IM', text: 'Isle of Man' },
  { value: 'IL', text: 'Israel' },
  { value: 'IT', text: 'Italy' },
  { value: 'JM', text: 'Jamaica' },
  { value: 'JP', text: 'Japan' },
  { value: 'JE', text: 'Jersey' },
  { value: 'JO', text: 'Jordan' },
  { value: 'KZ', text: 'Kazakhstan' },
  { value: 'KE', text: 'Kenya' },
  { value: 'KI', text: 'Kiribati' },
  { value: 'KP', text: "Korea, Democratic People's Republic of" },
  { value: 'KR', text: 'Korea, Republic of' },
  { value: 'KW', text: 'Kuwait' },
  { value: 'KG', text: 'Kyrgyzstan' },
  { value: 'LA', text: "Lao People's Democratic Republic" },
  { value: 'LV', text: 'Latvia' },
  { value: 'LB', text: 'Lebanon' },
  { value: 'LS', text: 'Lesotho' },
  { value: 'LR', text: 'Liberia' },
  { value: 'LY', text: 'Libya' },
  { value: 'LI', text: 'Liechtenstein' },
  { value: 'LT', text: 'Lithuania' },
  { value: 'LU', text: 'Luxembourg' },
  { value: 'MO', text: 'Macao' },
  { value: 'MK', text: 'Macedonia, the former Yugoslav Republic of' },
  { value: 'MG', text: 'Madagascar' },
  { value: 'MW', text: 'Malawi' },
  { value: 'MY', text: 'Malaysia' },
  { value: 'MV', text: 'Maldives' },
  { value: 'ML', text: 'Mali' },
  { value: 'MT', text: 'Malta' },
  { value: 'MH', text: 'Marshall Islands' },
  { value: 'MQ', text: 'Martinique' },
  { value: 'MR', text: 'Mauritania' },
  { value: 'MU', text: 'Mauritius' },
  { value: 'YT', text: 'Mayotte' },
  { value: 'MX', text: 'Mexico' },
  { value: 'FM', text: 'Micronesia, Federated States of' },
  { value: 'MD', text: 'Moldova, Republic of' },
  { value: 'MC', text: 'Monaco' },
  { value: 'MN', text: 'Mongolia' },
  { value: 'ME', text: 'Montenegro' },
  { value: 'MS', text: 'Montserrat' },
  { value: 'MA', text: 'Morocco' },
  { value: 'MZ', text: 'Mozambique' },
  { value: 'MM', text: 'Myanmar' },
  { value: 'NA', text: 'Namibia' },
  { value: 'NR', text: 'Nauru' },
  { value: 'NP', text: 'Nepal' },
  { value: 'NL', text: 'Netherlands' },
  { value: 'NC', text: 'New Caledonia' },
  { value: 'NZ', text: 'New Zealand' },
  { value: 'NI', text: 'Nicaragua' },
  { value: 'NE', text: 'Niger' },
  { value: 'NG', text: 'Nigeria' },
  { value: 'NU', text: 'Niue' },
  { value: 'NF', text: 'Norfolk Island' },
  { value: 'MP', text: 'Northern Mariana Islands' },
  { value: 'NO', text: 'Norway' },
  { value: 'OM', text: 'Oman' },
  { value: 'PK', text: 'Pakistan' },
  { value: 'PW', text: 'Palau' },
  { value: 'PS', text: 'Palestinian Territory, Occupied' },
  { value: 'PA', text: 'Panama' },
  { value: 'PG', text: 'Papua New Guinea' },
  { value: 'PY', text: 'Paraguay' },
  { value: 'PE', text: 'Peru' },
  { value: 'PH', text: 'Philippines' },
  { value: 'PN', text: 'Pitcairn' },
  { value: 'PL', text: 'Poland' },
  { value: 'PT', text: 'Portugal' },
  { value: 'PR', text: 'Puerto Rico' },
  { value: 'QA', text: 'Qatar' },
  { value: 'RE', text: 'Réunion' },
  { value: 'RO', text: 'Romania' },
  { value: 'RU', text: 'Russian Federation' },
  { value: 'RW', text: 'Rwanda' },
  { value: 'BL', text: 'Saint Barthélemy' },
  { value: 'SH', text: 'Saint Helena, Ascension and Tristan da Cunha' },
  { value: 'KN', text: 'Saint Kitts and Nevis' },
  { value: 'LC', text: 'Saint Lucia' },
  { value: 'MF', text: 'Saint Martin (French part)' },
  { value: 'PM', text: 'Saint Pierre and Miquelon' },
  { value: 'VC', text: 'Saint Vincent and the Grenadines' },
  { value: 'WS', text: 'Samoa' },
  { value: 'SM', text: 'San Marino' },
  { value: 'ST', text: 'Sao Tome and Principe' },
  { value: 'SA', text: 'Saudi Arabia' },
  { value: 'SN', text: 'Senegal' },
  { value: 'RS', text: 'Serbia' },
  { value: 'SC', text: 'Seychelles' },
  { value: 'SL', text: 'Sierra Leone' },
  { value: 'SG', text: 'Singapore' },
  { value: 'SX', text: 'Sint Maarten (Dutch part)' },
  { value: 'SK', text: 'Slovakia' },
  { value: 'SI', text: 'Slovenia' },
  { value: 'SB', text: 'Solomon Islands' },
  { value: 'SO', text: 'Somalia' },
  { value: 'ZA', text: 'South Africa' },
  { value: 'GS', text: 'South Georgia and the South Sandwich Islands' },
  { value: 'SS', text: 'South Sudan' },
  { value: 'ES', text: 'Spain' },
  { value: 'LK', text: 'Sri Lanka' },
  { value: 'SD', text: 'Sudan' },
  { value: 'SR', text: 'Suriname' },
  { value: 'SJ', text: 'Svalbard and Jan Mayen' },
  { value: 'SZ', text: 'Swaziland' },
  { value: 'SE', text: 'Sweden' },
  { value: 'CH', text: 'Switzerland' },
  { value: 'SY', text: 'Syrian Arab Republic' },
  { value: 'TW', text: 'Taiwan, Province of China' },
  { value: 'TJ', text: 'Tajikistan' },
  { value: 'TZ', text: 'Tanzania, United Republic of' },
  { value: 'TH', text: 'Thailand' },
  { value: 'TL', text: 'Timor-Leste' },
  { value: 'TG', text: 'Togo' },
  { value: 'TK', text: 'Tokelau' },
  { value: 'TO', text: 'Tonga' },
  { value: 'TT', text: 'Trinidad and Tobago' },
  { value: 'TN', text: 'Tunisia' },
  { value: 'TR', text: 'Turkey' },
  { value: 'TM', text: 'Turkmenistan' },
  { value: 'TC', text: 'Turks and Caicos Islands' },
  { value: 'TV', text: 'Tuvalu' },
  { value: 'UG', text: 'Uganda' },
  { value: 'UA', text: 'Ukraine' },
  { value: 'AE', text: 'United Arab Emirates' },
  { value: 'GB', text: 'United Kingdom' },
  { value: 'US', text: 'United States' },
  { value: 'UM', text: 'United States Minor Outlying Islands' },
  { value: 'UY', text: 'Uruguay' },
  { value: 'UZ', text: 'Uzbekistan' },
  { value: 'VU', text: 'Vanuatu' },
  { value: 'VE', text: 'Venezuela, Bolivarian Republic of' },
  { value: 'VN', text: 'Viet Nam' },
  { value: 'VG', text: 'Virgin Islands, British' },
  { value: 'VI', text: 'Virgin Islands, U.S.' },
  { value: 'WF', text: 'Wallis and Futuna' },
  { value: 'EH', text: 'Western Sahara' },
  { value: 'YE', text: 'Yemen' },
  { value: 'ZM', text: 'Zambia' },
  { value: 'ZW', text: 'Zimbabwe' },
];

const userValidation = Yup.object().shape({
  userPhoto: Yup.mixed()
    .test(
      'fileSize',
      `File needs to be less than ${userPhotoConfig.size}MB`,
      (value) => value[0] && value[0].size <= userPhotoConfig.size
    )
    .test(
      'fileType',
      `File needs to be in one of the following formats: ${userPhotoConfig.format}`,
      (value) => value[0] && userPhotoConfig.format.includes(value[0].type)
    ),
  userDescription: Yup.string().trim(),
  userCountry: Yup.string().trim(),
});

const Profile = ({ match, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
    modal: { open: false },
    tabs: { value: 0 },
  });
  const url = window.location;
  const title = store.main.brand;
  const history = useHistory();

  const {
    isSubmitting,
    setFieldValue,
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      userPhoto: state.user.photo,
      userDescription: state.user.description,
      userCountry: state.user.country,
    },
    validationSchema: userValidation,
    async onSubmit(values) {
      try {
        if (values.userPhoto.length) {
          const formData = new FormData();
          formData.append('userPhoto', values.userPhoto[0]);
          const {
            data: { userPhoto },
          } = await ax.post('/api/profile_image_upload', formData);
          values.userPhoto = userPhoto;
        }
        await ax.patch(`/api/user/${store.user.id}`, values);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const classes = ProfileStyles();

  const fetchUser = async () => {
    try {
      const { data } = await ax.get(`/api/user/${match.params.id}`);
      if (store.user.id === data.user._id) {
        setState({
          ...state,
          loading: false,
          user: { ...data.user, editable: true, artwork: data.artwork },
        });
      } else {
        setState({
          ...state,
          loading: false,
          user: { ...data.user, editable: false, artwork: data.artwork },
        });
      }
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  };

  const handleTabsChange = (event, newValue) => {
    setState((prevState) =>
      setState({ ...prevState, tabs: { value: newValue } })
    );
  };

  const handleChangeIndex = (index) => {
    setState((prevState) => setState({ ...prevState, tabs: { value: index } }));
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
      },
    }));
  };

  const handleModalClose = () => {
    resetForm();
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
      },
    }));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.user._id ? (
          <>
            <Grid item xs={12} md={4} className={classes.grid}>
              <Paper className={classes.paper}>
                <Card className={classes.user}>
                  <CardMedia
                    className={classes.avatar}
                    image={state.user.photo}
                    title={state.user.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      <Anchor component={Link} to={`/user/${state.user.name}`}>
                        {state.user.name}
                      </Anchor>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {state.user.description ||
                        "This user doesn't have much to say about themself"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {store.user.country
                        ? countries.find(
                            (country) => country.value === store.user.country
                          ).text
                        : "This user doesn't want to reveal their origin"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {`Joined ${formatDate(state.user.created, 'month')}`}
                    </Typography>
                  </CardContent>
                </Card>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<EditIcon />}
                  onClick={handleModalOpen}
                  fullWidth
                >
                  Edit info
                </Button>
                <br />
                <br />
                <Card className={classes.user}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Share this artist
                    </Typography>
                    <div className={classes.shareContainer}>
                      <div className={classes.socialContainer}>
                        <div className={classes.copyButton}>
                          <CopyToClipboard
                            text={url}
                            onCopy={() =>
                              enqueueSnackbar('Link copied', {
                                variant: 'success',
                                autoHideDuration: 1000,
                                anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'center',
                                },
                              })
                            }
                          >
                            <CopyIcon />
                          </CopyToClipboard>
                        </div>
                        Copy link
                      </div>
                      <div className={classes.socialContainer}>
                        <FacebookShareButton
                          url={url}
                          quote={title}
                          className={classes.socialButton}
                        >
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        Facebook
                      </div>
                      <div className={classes.socialContainer}>
                        <TwitterShareButton
                          url={url}
                          title={title}
                          className={classes.socialButton}
                        >
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        Twitter
                      </div>
                      <div className={classes.socialContainer}>
                        <RedditShareButton
                          url={url}
                          title={title}
                          windowWidth={660}
                          windowHeight={460}
                          className={classes.socialButton}
                        >
                          <RedditIcon size={32} round />
                        </RedditShareButton>
                        Reddit
                      </div>
                      <div className={classes.socialContainer}>
                        <WhatsappShareButton
                          url={url}
                          title={title}
                          separator=":: "
                          className={classes.socialButton}
                        >
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        WhatsApp
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} className={classes.grid}>
              {state.user.editable ? (
                <Paper className={classes.artwork} variant="outlined">
                  <div className={classes.tabs}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={state.tabs.value}
                        onChange={handleTabsChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab label="User artwork" {...a11yProps(0)} />
                        <Tab label="Saved artwork" {...a11yProps(1)} />
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis="x"
                      index={state.tabs.value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <Box hidden={state.tabs.value !== 0}>
                        {state.user.artwork.length ? (
                          <Gallery elements={state.user.artwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no artwork to display
                          </Typography>
                        )}
                      </Box>
                      <Box hidden={state.tabs.value !== 1}>
                        {state.user.savedArtwork.length ? (
                          <Gallery elements={state.user.savedArtwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no saved artwork
                          </Typography>
                        )}
                      </Box>
                      <Box hidden={state.tabs.value !== 2}>
                        {state.user.purchasedArtwork.length ? (
                          <Gallery elements={state.user.purchasedArtwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no purchased artwork
                          </Typography>
                        )}
                      </Box>
                    </SwipeableViews>
                  </div>
                </Paper>
              ) : (
                <Paper className={classes.artwork} variant="outlined">
                  <div className={classes.tabs}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={state.tabs.value}
                        onChange={handleTabsChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab label="User artwork" {...a11yProps(0)} />
                        {state.user.displaySaves ? (
                          <Tab label="Saved artwork" {...a11yProps(1)} />
                        ) : null}
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis="x"
                      index={state.tabs.value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <Box hidden={state.tabs.value !== 0}>
                        {state.user.artwork.length ? (
                          <Gallery elements={state.user.artwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            This user has no artwork to display
                          </Typography>
                        )}
                      </Box>
                      {state.user.displaySaves ? (
                        <Box hidden={state.tabs.value !== 1}>
                          {state.user.savedArtwork.length ? (
                            <Gallery elements={state.user.savedArtwork} />
                          ) : (
                            <Typography variant="h6" align="center">
                              This user has no saved artwork
                            </Typography>
                          )}
                        </Box>
                      ) : null}
                    </SwipeableViews>
                  </div>
                </Paper>
              )}
            </Grid>
          </>
        ) : (
          history.push('/')
        )}
        <div>
          <Modal
            open={state.modal.open}
            onClose={handleModalClose}
            aria-labelledby="Edit info"
            className={classes.modal}
          >
            <form className={classes.userForm} onSubmit={handleSubmit}>
              <div className={classes.userContainer}>
                <Card className={classes.card}>
                  <Typography variant="h6" align="center">
                    Edit info
                  </Typography>
                  <CardContent>
                    <UploadInput
                      name="userPhoto"
                      setFieldValue={setFieldValue}
                    />
                    <TextField
                      name="userDescription"
                      label="Description"
                      type="text"
                      value={values.userDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        touched.userDescription ? errors.userDescription : ''
                      }
                      error={
                        touched.userDescription &&
                        Boolean(errors.userDescription)
                      }
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                    <SelectInput
                      name="userCountry"
                      label="Country"
                      value={values.userCountry}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      helperText={touched.userCountry ? errors.userCountry : ''}
                      error={touched.userCountry && Boolean(errors.userCountry)}
                      options={countries}
                    />
                  </CardContent>
                  <CardActions className={classes.actions}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      color="error"
                      onClick={handleModalClose}
                    >
                      Close
                    </Button>
                  </CardActions>
                </Card>
              </div>
            </form>
          </Modal>
        </div>
      </Grid>
    </Container>
  );
};

export default withSnackbar(Profile);
