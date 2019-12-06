import React from "react";
import {
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListSubheader,
  makeStyles,
  Typography
} from "@material-ui/core";
import { AppState } from "../redux";
import {
  addConceptsToCollectionErrorListSelector,
  addConceptsToCollectionLoadingListSelector,
  addConceptsToCollectionProgressListSelector
} from "../apps/collections";
import { connect } from "react-redux";
import Header from "./Header";

interface Props {
  loadingList: boolean[];
  inProgressList: string[];
  erroredList: [];
  successList: {}[];
}

const SEPARATOR = "--";

const useStyles = makeStyles({
  card: {
    width: "100%"
  }
});

const InProgressPage: React.FC<Props> = ({
  loadingList,
  inProgressList,
  erroredList,
  successList
}) => {
  const inProgressItems = loadingList
    .map((loading: boolean, index: number) =>
      loading ? inProgressList[index] : null
    )
    .filter(item => item)
    .reverse() as string[];
  const successfullItems = loadingList
    .map((loading: boolean, index: number) =>
      !loading && !erroredList[index]
        ? {
            result: successList[index],
            progress: inProgressList[index]
          }
        : null
    )
    .filter(item => item && item.progress)
    .reverse() as { result: []; progress: string }[];
  const erroredItems = loadingList
    .map((loading: boolean, index: number) =>
      !loading && erroredList[index]
        ? {
            error: erroredList[index],
            progress: inProgressList[index]
          }
        : null
    )
    .filter(item => item && item.progress)
    .reverse() as { error: string; progress: string }[];

  console.log(loadingList, inProgressList, inProgressItems);

  const classes = useStyles();

  return (
    <Header title="Progress Notifications">
      <Grid item xs={6}>
        {!inProgressItems.length ? null : (
          <List
            component="div"
            subheader={
              <ListSubheader component="div">In progress</ListSubheader>
            }
          >
            {inProgressItems.map(item => (
              <ListItem key={item}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography noWrap variant="subtitle1">
                      {item.split(SEPARATOR)[0]}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {item.split(SEPARATOR)[1] || ""}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
        {!erroredItems.length ? null : (
          <List
            component="div"
            subheader={<ListSubheader component="div">Failed</ListSubheader>}
          >
            {erroredItems.map(item => (
              <ListItem key={item.progress}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography noWrap variant="subtitle1">
                      {item.progress.split(SEPARATOR)[0]}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {item.error}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
        {!successfullItems ? null : (
          <List
            component="div"
            subheader={<ListSubheader component="div">Completed</ListSubheader>}
          >
            {successfullItems.map(item => (
              <ListItem key={item.progress}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography noWrap variant="subtitle1">
                      {item.progress.split(SEPARATOR)[0]}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {item.progress.split(SEPARATOR)[1] || ""}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
      </Grid>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  isLoggedIn: state.auth.isLoggedIn,
  loadingList: addConceptsToCollectionLoadingListSelector(state),
  inProgressList: addConceptsToCollectionProgressListSelector(state),
  erroredList: addConceptsToCollectionErrorListSelector(state),
  successList: state.collections.addReferencesResults
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InProgressPage);
