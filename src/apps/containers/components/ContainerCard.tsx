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
  Link
} from "@material-ui/core";
import {Link as RouterLink, useLocation} from "react-router-dom";

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
  })
);
const ContainerCard: React.FC<Props> = ({
  name,
  short_code,
  owner,
  owner_type,
  description,
  url,
  index
}) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Grid item xs={4}>
      <Link underline='none' component={RouterLink} to={url}>
        <Card>
          <CardContent>
            <Typography noWrap variant='body1' color='textSecondary' gutterBottom data-testid={`shortCode-${index}`}>
              {short_code}
            </Typography>
            <Typography className={classes.containerName} noWrap variant='h5' data-testid={`name-${index}`}>
              {name}
            </Typography>
            <Typography noWrap variant='body2' color='textSecondary' data-testid={`owner-${index}`}>
              {owner_type}/{owner}
            </Typography>
            <Typography noWrap variant='body1' component='p' data-testid={`description-${index}`}>
              {description}
            </Typography>
          </CardContent>
          <CardActions>
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
          </CardActions>
        </Card>
      </Link>
    </Grid>
  );
};

export default ContainerCard;
