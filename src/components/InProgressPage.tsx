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
  addConceptsToDictionaryErrorListSelector,
  addConceptsToDictionaryLoadingListSelector,
  addConceptsToDictionaryProgressListSelector,
  buildAddConceptToDictionaryMessage
} from "../apps/dictionaries";
import { connect } from "react-redux";
import Header from "./Header";

interface Props {
  loadingList?: (boolean | undefined)[];
  inProgressList?: (string | undefined)[];
  erroredList?: [];
  successList?: ({ payload: {} } | undefined)[];
}

const SEPARATOR = "--";

const useStyles = makeStyles({
  card: {
    width: "100%"
  },
  scrollLongText: {
    overflowX: "scroll"
  }
});

const InProgressPage: React.FC<Props> = ({
  loadingList = [],
  inProgressList = [],
  erroredList = [],
  successList = []
}) => {
  const inProgressItems = (loadingList.filter(item => !!item) as boolean[])
    .map((loading: boolean, index: number) =>
      loading ? inProgressList[index] : null
    )
    .filter(item => item)
    .reverse() as string[];
  const successfullItems = (loadingList.filter(item => !!item) as boolean[])
    .map((loading: boolean, index: number) =>
      !loading && !erroredList[index]
        ? {
            result: successList[index]?.payload || "Successful",
            progress: inProgressList[index]
          }
        : null
    )
    .filter(item => item && item.progress)
    .reverse() as { result: []; progress: string }[];
  const erroredItems = (loadingList.filter(item => !!item) as boolean[])
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

  console.log(
    loadingList,
    inProgressList,
    inProgressItems,
    successfullItems,
    successList
  );

  const classes = useStyles();

  return (
    <Header title="Progress Notifications">
      <Grid item xs={6}>
        {inProgressItems.length +
        erroredItems.length +
        successfullItems.length ? null : (
          <Typography align="center">Your actions will appear here</Typography>
        )}
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
                    <Typography
                      noWrap
                      variant="subtitle1"
                      className={classes.scrollLongText}
                    >
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
                    <Typography
                      noWrap
                      variant="subtitle1"
                      className={classes.scrollLongText}
                    >
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
        {!successfullItems.length ? null : (
          <List
            component="div"
            subheader={<ListSubheader component="div">Completed</ListSubheader>}
          >
            {successfullItems.map(item => (
              <ListItem key={item.progress}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography
                      noWrap
                      variant="subtitle1"
                      className={classes.scrollLongText}
                    >
                      {item.progress.split(SEPARATOR)[0]}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {buildAddConceptToDictionaryMessage(item.result)}
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
  loadingList: addConceptsToDictionaryLoadingListSelector(state),
  inProgressList: addConceptsToDictionaryProgressListSelector(state),
  erroredList: addConceptsToDictionaryErrorListSelector(state),
  successList: state.dictionaries.addReferencesResults
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InProgressPage);
