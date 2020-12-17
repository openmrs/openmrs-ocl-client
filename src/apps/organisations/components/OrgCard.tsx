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
import {Link, useLocation} from "react-router-dom";

interface Props {
  name: string;
  url: string;
  index: number;
  id: string
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerName: {
      overflowX: "auto",
    },
  })
);
const OrganisationCard: React.FC<Props> = ({
  name,
  url,
  id,
  index
}) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Grid item xs={4}>
      <Card>
        <CardContent>
          <Typography className={classes.containerName} noWrap variant='h5' data-testid={`name-${index}`}>
            {name}
          </Typography>
          <Typography noWrap variant='body1' component='p' data-testid={`url-${index}`}>
            {id}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            to={{pathname: url, state: { prevPath: location.pathname }}}
            component={Link}
            size='small'
            variant='text'
            color='primary'
            disabled
            data-testid={`viewButton-${index}`}
          >
            View
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default OrganisationCard;
