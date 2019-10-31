import React from 'react';
import {AppBar, createStyles, Grid, makeStyles, Theme, Toolbar, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            left: theme.spacing(7) + 1,
        },
        content: {
            marginTop: '6vh',
            height: '100%',
        },
    }),
);

interface Props {
    children: any,
    title: string,
    justifyChildren?: string,
}

const Header: React.FC<Props> = ({children, title, justifyChildren = 'center'}) => {
    const classes = useStyles();

    return (
        <div>
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                    <Typography variant="h5" noWrap>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid
                container
                className={classes.content}
                component="div"
                // @ts-ignore
                justify={justifyChildren}
                alignItems="flex-start"
            >
                {children}
            </Grid>
        </div>
    );
};

export default Header;
