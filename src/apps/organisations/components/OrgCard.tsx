import React from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Theme,
  Typography
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Link as RouterLink, useLocation, useHistory } from "react-router-dom";
interface Props {
  name: string;
  url: string;
  index: number;
  id: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerName: {
      overflowX: "auto"
    },
    button: {
      margin: theme.spacing(1)
    },
    card: {
      cursor: "pointer"
    }
  })
);
const OrganisationCard: React.FC<Props> = ({ name, url, id, index }) => {
  const classes = useStyles();
  const location = useLocation();
  const { push: goTo } = useHistory();

  return (
    <Grid item xs={4}>
      <Card onClick={() => goTo(url)} className={classes.card}>
        <CardContent>
          <Typography
            noWrap
            variant="body1"
            color="textSecondary"
            gutterBottom
            data-testid={`org-id-${index}`}
          >
            {id}
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
            variant="body1"
            component="p"
            data-testid={`url-${index}`}
          >
            {url}
          </Typography>
        </CardContent>
        <Button
          to={{ pathname: url, state: { prevPath: location.pathname } }}
          component={RouterLink}
          size="small"
          variant="text"
          color="primary"
          data-testid={`viewButton-${index}`}
        >
          View
        </Button>
      </Card>
    </Grid>
  );
};

export default OrganisationCard;
