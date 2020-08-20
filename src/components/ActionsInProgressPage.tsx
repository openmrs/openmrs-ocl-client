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
  addConceptsToDictionaryProgressListSelector, APIDictionary,
  buildAddConceptToDictionaryMessage
} from "../apps/dictionaries";
import { connect } from "react-redux";
import Header from "./Header";
import {dictionarySelector} from "../apps/dictionaries/redux";
import { getLocalStorageObject, updateLocalStorageArray} from "../redux/localStorageUtils";

interface Props {
  loadingList?: (boolean | undefined)[];
  inProgressList?: (string | undefined)[];
  erroredList?: [];
  successList?: ({ payload: {} } | undefined)[];
  dictionary?: APIDictionary;
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

const ActionsInProgressPage: React.FC<Props> = ({
  loadingList = [],
  inProgressList = [],
  erroredList = [],
  successList = [],
  dictionary
}) => {
  const dictionaryName = dictionary?.name+"-" || "";
  const inProgressListLocalStorage = inProgressList?.length > 0 ? updateLocalStorageArray({
    name:'notification',
    key: 'inProgressList',
    value: dictionaryName + inProgressList[inProgressList.length - 1] ,
    list: inProgressList
  }) : getLocalStorageObject({name:'notification', key:'inProgressList', value: inProgressList});

  const loadingListLocalStorage = loadingList?.length > 0 ? updateLocalStorageArray({
      name:'notification',
      key: 'loadingList',
      value: loadingList[loadingList.length - 1],
      list: loadingList
    }) : getLocalStorageObject({name:'notification', key:'loadingList', value: loadingList});

  const erroredListLocalStorage = erroredList?.length > 0 ? updateLocalStorageArray({
    name:'notification',
    key: 'erroredList',
    value: erroredList[erroredList.length - 1],
    list: erroredList
  }) : getLocalStorageObject({name:'notification', key:'erroredList', value: erroredList});

  const successListLocalStorage = successList?.length > 0 ? updateLocalStorageArray({
    name:'notification',
    key: 'successList',
    value: successList[successList.length - 1],
    list: successList
  }) : getLocalStorageObject({name:'notification', key:'successList', value: successList});

  const inProgressItems = loadingListLocalStorage
    .map((loading: boolean | undefined, index: number) =>
      typeof loading == "boolean" && loading ? inProgressListLocalStorage[index] : null
    )
    .filter((item: any) => item)
    .reverse() as string[];

  const successfullItems = loadingListLocalStorage
    .map((loading: boolean | undefined, index: number) =>
      typeof loading == "boolean" && !loading && !erroredListLocalStorage[index]
        ? {
            result: successListLocalStorage[index]?.payload || "Successful",
            progress: inProgressListLocalStorage[index]
          }
        : null
    )
    .filter((item: any) => item && item.progress)
    .reverse() as { result: []; progress: string }[];

  const erroredItems = loadingListLocalStorage
    .map((loading: boolean | undefined, index: number) =>
      typeof loading == "boolean" && !loading && erroredListLocalStorage[index]
        ? {
            error: erroredListLocalStorage[index],
            progress: inProgressListLocalStorage[index]
          }
        : null
    )
    .filter((item: any) => item && item.progress)
    .reverse() as { error: string; progress: string }[];

  const classes = useStyles();

  return (
    <Header title="Progress Notifications">
      <Grid item xs={6}>
        {inProgressItems.length +
        erroredItems.length +
        successfullItems.length ? null : (
          <Typography align="center">
            Your actions in this session will appear here
          </Typography>
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
  successList: state.dictionaries.addReferencesResults,
  dictionary: dictionarySelector(state),
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsInProgressPage);
