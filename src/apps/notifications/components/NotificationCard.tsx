import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  ListItem,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ImportMetaData } from "../../dictionaries";
import { dictionaryNameFromUrl } from "../../dictionaries/utils";
import { NotificationItem } from "../types";

dayjs.extend(relativeTime);

interface Props {
  headerMessage: string;
  subHeaderMessage: string;
  importMetaData: ImportMetaData;
  openNotificationDetails?: Function;
  notification?: NotificationItem;
}

const useStyles = makeStyles({
  card: {
    width: "100%",
  },
  chip: {
    maxWidth: 200,
  },
  cardFooter: {
    paddingLeft: 8,
  },
  cardContent: {
    paddingBottom: 2,
  },
  showDetailsButton: {
      textAlign: "right"
  },
  cardActions: {
    justifyContent: "space-between"
  }
});

const NotificationCard: React.FC<Props> = ({
  headerMessage,
  subHeaderMessage,
  importMetaData,
  openNotificationDetails,
  notification,
}) => {
  const classes = useStyles();

  const [importDateTime, importDictionary] = [
    new Date(importMetaData.dateTime),
    importMetaData.dictionary,
  ];

  const showImportDateTime = () => {
    return (
      <Typography
        variant="subtitle2"
        color="textSecondary"
        className={classes.cardFooter}
      >
        <Tooltip
          title={dayjs(importDateTime).format("DD MMM YYYY HH:mm")}
          enterDelay={700}
        >
          <span>{dayjs(importDateTime).fromNow()}</span>
        </Tooltip>
      </Typography>
    );
  };

  const showDictionaryName = () => {
    return (
      <Tooltip title={"Redirect to Dictionary"}>
        <Chip
          color="primary"
          size="small"
          className={classes.chip}
          label={dictionaryNameFromUrl(importDictionary)}
          component="a"
          href={importDictionary}
          clickable
        />
      </Tooltip>
    );
  };

  const showDetails = () => {
    if (notification && openNotificationDetails) {
      return (
        <Button
          variant="text"
          color="primary"
          onClick={() => openNotificationDetails(notification, dayjs(importDateTime).format("DDMMMYYYY_HHmm"))}
          className={classes.showDetailsButton}
        >
          View Summary
        </Button>
      );
    }
  };

  return (
    <>
      {!importMetaData ? null : (
        <ListItem>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              {showDictionaryName()}
              <Typography noWrap variant="subtitle1">
                {headerMessage}
              </Typography>
              <Typography noWrap variant="subtitle2" color="textSecondary">
                {subHeaderMessage}
              </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                {showImportDateTime()}
                {showDetails()}
            </CardActions>
          </Card>
        </ListItem>
      )}
    </>
  );
};

export default NotificationCard;
