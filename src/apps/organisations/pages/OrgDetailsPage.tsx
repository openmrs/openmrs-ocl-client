import React from "react";
import {Grid, Paper, Typography} from "@material-ui/core";
import Header from "../../../components/Header";


const ViewOrganizationDetailsPage: React.FC = ( ) => {
    return (
        <Header
            title="My Organization Details"
            justifyChildren='space-around'
        >
            <Grid id='viewOrganizationDetailspage' item xs={5} component='div'>
                <Paper className='fieldsetParent'>
                    <fieldset>
                        <Typography component='legend' variant='h5' gutterBottom>
                            Sources
                        </Typography>
                    
                    </fieldset>
                </Paper>
            </Grid>
            <Grid id='viewOrganizationDetailspage' item xs={5} component='div'>
                <Paper className='fieldsetParent'>
                    <fieldset>
                        <Typography component='legend' variant='h5' gutterBottom>
                           Collections
                        </Typography>
                    
                    </fieldset>
                </Paper>
            </Grid>
            <Grid id='viewOrganizationDetailspage' item xs={5} component='div'>
                <Paper className='fieldsetParent'>
                    <fieldset>
                        <Typography component='legend' variant='h5' gutterBottom>
                            Members
                        </Typography>
                    
                    </fieldset>
                </Paper>
            </Grid>
                <Grid id='viewOrganizationDetailspage' item xs={5} component='div'>
                <Paper className='fieldsetParent'>
                    <fieldset>
                        <Typography component='legend' variant='h5' gutterBottom>
                            Sources
                        </Typography>
                    
                    </fieldset>
                </Paper>
            </Grid>
        </Header>
    );
};

export default ViewOrganizationDetailsPage;

