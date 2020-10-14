import React from "react";
import {
  Chip,
  Grid,
  List,
  Typography
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from '@material-ui/icons/Error';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { AppState } from "../redux";
import {
  addConceptsToDictionaryErrorListSelector,
  addConceptsToDictionaryLoadingListSelector,
  addConceptsToDictionaryProgressListSelector,
  buildAddConceptToDictionaryMessage,
  ImportMetaData,
} from "../apps/dictionaries";
import { connect } from "react-redux";
import Header from "./Header";
import { getLocalStorageObject } from "../redux/localStorageUtils";
import NotificationCard from "./NotificationCard";

interface Props {
  loadingList?: (boolean | undefined)[];
  inProgressList?: (string | undefined)[];
  erroredList?: [];
  successList?: ({ payload: {} } | undefined)[];
}
const SEPARATOR = "--";

const ActionsInProgressPage: React.FC<Props> = ({
  loadingList = [],
  inProgressList = [],
  erroredList = [],
  successList = []
}) => {
  const inProgressListLocalStorage = getLocalStorageObject({name:'notification', key:'inProgressList', value: inProgressList});

  const loadingListLocalStorage = getLocalStorageObject({name:'notification', key:'loadingList', value: loadingList});

  const erroredListLocalStorage = getLocalStorageObject({name:'notification', key:'erroredList', value: erroredList});

  const successListLocalStorage = getLocalStorageObject({name:'notification', key:'successList', value: successList});

  const inProgressItems = loadingListLocalStorage
    .map((loading: boolean | undefined, index: number) =>
      typeof loading == "boolean" && loading ? inProgressListLocalStorage[index] : null
    )
    .filter((item: any) => item)
    .reverse() as string[];

  const successfulItems = loadingListLocalStorage
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

  const importMetaDataItemsList: ImportMetaData[] = [];

  const importMetaDataItems = getLocalStorageObject({
    name: "notification",
    key: "importMetaDataList",
    value: importMetaDataItemsList,
  }).reverse() as ImportMetaData[];

  return (
    <Header title="Progress Notifications">
      <Grid item xs={6}>
        {inProgressItems.length +
        erroredItems.length +
        successfulItems.length ? null : (
          <Typography align="center">
            Your actions in this session will appear here
          </Typography>
        )}
        {!inProgressItems.length || !importMetaDataItems.length ? null : (
            <List
                subheader={
                  <Chip
                      label='In Progress'
                      icon={<AutorenewIcon />}
                  />
                }
            >
            {inProgressItems.map((item, index) => (
                <NotificationCard
                    key={index}
                    headerMessage={item.split(SEPARATOR)[0]}
                    subHeaderMessage={item.split(SEPARATOR)[1] || ""}
                    importMetaData={importMetaDataItems[index]}
                />
            ))}
          </List>
        )}
        {!erroredItems.length || !importMetaDataItems.length? null : (
            <List
                  subheader={
                    <Chip
                        label='Failed'
                        icon={<ErrorIcon />}
                    />
                  }
            >
            {erroredItems.map((item, index) => (
                <NotificationCard
                    key={index}
                    headerMessage={item.progress.split(SEPARATOR)[0]}
                    subHeaderMessage={item.error}
                    importMetaData={importMetaDataItems[index]}
                />
            ))}
          </List>
        )}
        {!successfulItems.length || !importMetaDataItems.length ? null : (
            <List
                subheader={
                  <Chip
                      label='Completed'
                      icon={<CheckCircleIcon />}
                  />
                }
            >
            {successfulItems.map((item, index) => (
                <NotificationCard
                    key={index}
                    headerMessage={item.progress.split(SEPARATOR)[0]}
                    subHeaderMessage={buildAddConceptToDictionaryMessage(item.result)}
                    importMetaData={importMetaDataItems[index]}
                />
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
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsInProgressPage);
