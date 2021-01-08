import React from "react";
import {
  Button,
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
  Link
} from "@material-ui/core";
import {Link as RouterLink, useLocation} from "react-router-dom";

interface Props {
  name: string;
  url: string;
  index: number;
  id: string;
  organisation? : {};
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerName: {
      overflowX: "auto",
    },
    button: {
      margin: theme.spacing(1),
    }
  })
);
const OrganisationCard: React.FC<Props> = ({
  name,
  url,
  id,
  index,
}) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Grid item xs={4}>
      <Link underline='none' component={RouterLink} to={`/user${url}`}>
      <Card>
        <CardContent>
          <Typography className={classes.containerName} noWrap variant='h5' data-testid={`name-${index}`}>
            {name}
          </Typography>
          <Typography noWrap variant='body1' component='p' data-testid={`url-${index}`}>
            {id}
          </Typography>
        </CardContent>
          <Button
            to={{pathname: url, state: { prevPath: location.pathname }}}
            component={RouterLink}
            size='small'
            variant='text'
            color='primary'
            data-testid={`viewButton-${index}`}
          >
            View
          </Button>   
      </Card>
      </Link>
    </Grid>
  );
};

export default OrganisationCard;
