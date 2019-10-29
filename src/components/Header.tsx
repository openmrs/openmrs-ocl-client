import React from 'react';
import {Container, Grid, Typography} from "@material-ui/core";
import "./Header.scss";

interface Props {
    children: any,
    title: string,
    justifyChildren?: string,
}

const Header: React.FC<Props> = ({children, title, justifyChildren='center'}) => {
    return (
        <div id="header-page">
            <Typography id="heading" variant="h4" gutterBottom>
                {title}
            </Typography>
            <Grid
                id="content"
                container
                className="fill-parent-height"
                component="div"
                // @ts-ignore
                justify={justifyChildren}
                alignItems="flex-start"
            >
                {children}
            </Grid>
        </div>
    )
};

export default Header;
