import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { Link, useLocation, useHistory } from "react-router-dom";
import { VerifiedUser } from "@material-ui/icons";

interface Props {
  name: string;
  short_code: string;
  owner: string;
  owner_type: string;
  description: string;
  url: string;
  index: number;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerName: {
      overflowX: "auto",
    },
    card: {
      cursor: "pointer",
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    },
    details: {
      display: "flex",
      flexDirection: "column",
    },
    trustedIcon: {
      fill: "#3F51B5",
      fontSize: 50,
      margin: "2rem",
    },
  })
);
const ContainerCard: React.FC<Props> = ({
  name,
  short_code,
  owner,
  owner_type,
  description,
  url,
  index,
}) => {
  const classes = useStyles();
  const location = useLocation();
  const { push: goTo } = useHistory();

  return (
    <Grid item xs={4}>
      <Card onClick={() => goTo(url)} className={classes.card}>
        <div className={classes.details}>
          <CardContent>
            <Typography
              noWrap
              variant="body1"
              color="textSecondary"
              gutterBottom
              data-testid={`shortCode-${index}`}
            >
              {short_code}
            </Typography>
            <Typography
              className={classes.containerName}
              noWrap
              variant="h5"
              data-testid={`name-${index}`}
            >
              {name}
            </Typography>
            <Typography
              noWrap
              variant="body2"
              color="textSecondary"
              data-testid={`owner-${index}`}
            >
              {owner_type}/{owner}
            </Typography>
            <Typography
              noWrap
              variant="body1"
              component="p"
              data-testid={`description-${index}`}
            >
              {description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              to={{ pathname: url, state: { prevPath: location.pathname } }}
              component={Link}
              size="small"
              variant="text"
              color="primary"
              data-testid={`viewButton-${index}`}
            >
              View
            </Button>
          </CardActions>
        </div>
        <div>
          {name === "CIEL" ? (
            <VerifiedUser className={classes.trustedIcon} />
          ) : (
            ""
          )}
        </div>
      </Card>
    </Grid>
  );
};

export default ContainerCard;
