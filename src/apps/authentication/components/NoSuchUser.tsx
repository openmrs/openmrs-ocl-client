import React, {useState} from 'react';
import { makeStyles } from "@material-ui/core";
import { Alert, AlertTitle} from '@material-ui/lab';
import { loadState } from "../../../redux/store";


interface Props {
  status?: string;
}
const useStyles = makeStyles({ alertBorder: {
    border: 80,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    padding: '0 30px',
    borderBlockColor: 'black'
  }

});

const[status, useStatus] = useState(loadState);


const NoSuchUser: React.FC<Props> = ({status}) => {
  
    const classes = useStyles();
    if(!status) return ;
    else
      return (
        <div>
          <Alert variant="filled" severity="error" className={classes.alertBorder}>
             <AlertTitle>Error</AlertTitle>
                  No Such User or Wrong Password
            </Alert>
            </div>
    );
}

export default NoSuchUser;