import React from "react";
import {Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {APIOrg} from "../types";
import List from "@material-ui/core/List";
import * as _ from "lodash";

interface Props {
    orgs?: APIOrg[];
}

const useStyles = makeStyles({
    container: {
        minWidth: "0"
    },
    orgList: {
        maxHeight: 280,
        overflow: "scroll",
        color: "black"
    },
    orgItem: {
        paddingBottom: "12px"
    }
});

const UserOrganisationDetails: React.FC<Props> = ({
                                                      orgs
                                                  }) => {
    const classes = useStyles();

    const getUserOrganisationsList = () => {
        const OrganisationsList: Array<JSX.Element> = [];
        if (orgs) {
            _.sortBy(orgs, (org) => org.name).map(org => (
                OrganisationsList.push(
                    <li key={org.id} className={classes.orgItem}>
                        {org.name}
                    </li>
                )
            ));
        }
        return OrganisationsList;
    };

    const getUserOrgsEmptyMessage = () => {
        if (orgs && (orgs.length === 0)) {
            return (<Typography data-testid="noUserOrgsMessage" align='center'>You're not part of any Organisation</Typography>)
        }
        return null;
    };

    return (
        <Paper className='fieldsetParent'>
            <fieldset className={classes.container}>
                <Typography component='legend' variant='h5' gutterBottom>
                    Your Organisations
                </Typography>
                {getUserOrgsEmptyMessage()}
                <List className={classes.orgList}>
                    <ul>
                        {getUserOrganisationsList()}
                    </ul>
                </List>
            </fieldset>
        </Paper>
    );
};


export default UserOrganisationDetails;
