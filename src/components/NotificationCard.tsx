import React from "react";
import {Card, CardActions, CardContent, Chip, ListItem, makeStyles, Tooltip, Typography} from "@material-ui/core";
import moment from "moment";
import { ImportMetaData } from "../apps/dictionaries";
import { dictionaryNameFromUrl } from "../apps/dictionaries/utils";

interface Props {
    headerMessage: string,
    subHeaderMessage: string,
    importMetaData: ImportMetaData
}

const useStyles = makeStyles({
    card: {
        width: "100%"
    },
    chip: {
        maxWidth: 200,
    },
    cardFooter: {
        paddingLeft: 8,
    },
    cardContent: {
        paddingBottom: 2
    }
});

const NotificationCard: React.FC<Props> = ({
                                               headerMessage,
                                               subHeaderMessage,
                                               importMetaData
                                           }) => {
    const classes = useStyles();

    const [importDateTime, importDictionary] = [new Date(importMetaData.dateTime), importMetaData.dictionary];


    const showImportDateTime = () => {
        return (
            <Typography variant='subtitle2' color='textSecondary' className={classes.cardFooter}>
                <Tooltip title={moment(importDateTime).format("DD MMM YYYY HH:mm")} enterDelay={700}>
                    <span>{moment(importDateTime).fromNow()}</span>
                </Tooltip>
            </Typography>
        );
    };

    const showDictionaryName = () => {
        return (
            <Tooltip title={"Redirect to Dictionary"}>
            <Chip
                color='primary'
                size='small'
                className={classes.chip}
                label={dictionaryNameFromUrl(importDictionary)}
                component='a'
                href={importDictionary}
                clickable
            />
            </Tooltip>
        );
    };

    return (
        <>
        {!importMetaData ? null:
                (<ListItem>
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    {showDictionaryName()}
                    <Typography
                        noWrap
                        variant="subtitle1"
                    >
                        {headerMessage}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        {subHeaderMessage}
                    </Typography>
                </CardContent>
                <CardActions>{showImportDateTime()}</CardActions>
            </Card>
        </ListItem>)}
        </>
    )
}

export default NotificationCard;
