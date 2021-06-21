import {
  LocationOnRounded as LocationIcon,
  PersonRounded as MemberIcon,
  StarRounded as StarIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Typography from "../../domain/Typography";
import { renderUserData } from "../../utils/helpers.js";
import profileCardStyles from "./styles.js";

const ProfileCard = ({ user, loading }) => {
  // const userId = useUserStore((state) => state.id);

  // const buyer = useOrderDetails((state) => state.order.data.buyer);
  // const seller = useOrderDetails((state) => state.order.data.seller);
  // const loading = useOrderDetails((state) => state.order.loading);

  // const user = buyer.id === userId ? buyer : seller;

  const classes = profileCardStyles();

  return (
    <Card className={classes.container}>
      <Box className={classes.wrapper}>
        <Avatar
          component={RouterLink}
          to={`/user/${user.name}`}
          alt={user.name}
          src={user.avatar ? user.avatar.source : null}
          title={user.name}
          loading={loading}
          variant="circle"
          className={classes.avatar}
        />
      </Box>
      <CardContent className={classes.content}>
        <Typography
          component={RouterLink}
          to={`/user/${user.name}`}
          gutterBottom
          variant="h5"
          color="textPrimary"
          loading={loading}
          className={classes.name}
        >
          {renderUserData({
            data: user.name,
            isUsername: true,
          })}
        </Typography>
        <Box className={classes.info} loading={loading}>
          {user.rating > 0 && (
            <Box className={classes.rating}>
              <StarIcon fontSize="small" className={classes.icon} />
              <Typography variant="body1" color="textSecondary" component="p">
                {renderUserData({
                  data: user.rating,
                  isUsername: false,
                })}
              </Typography>
            </Box>
          )}
          {user.country && (
            <Box className={classes.country}>
              <LocationIcon fontSize="small" className={classes.icon} />
              <Typography variant="body2" color="textSecondary" component="p">
                {renderUserData({
                  data: user.country,
                  isUsername: false,
                })}
              </Typography>
            </Box>
          )}
          {user.created && (
            <Box className={classes.joined}>
              <MemberIcon fontSize="small" className={classes.icon} />
              <Typography variant="body2" color="textSecondary" component="p">
                {renderUserData({
                  data: formatDate(new Date(user.created), "MMM yy"),
                  isUsername: false,
                })}
              </Typography>
            </Box>
          )}
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          loading={loading}
          className={classes.description}
        >
          {renderUserData({
            data: user.description,
            isUsername: false,
            fallback: `${user.active ? "Nothing here yet" : "[deleted]"}`,
          })}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
