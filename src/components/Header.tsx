import React from 'react';
import {Container, Grid, Typography} from "@material-ui/core";
import "./Header.scss";

interface Props {
    children: any,
    title: string,
}

const Header: React.FC<Props> = ({children, title}) => {
    return (
        <div id="header-page">
            <Typography id="heading" variant="h4" gutterBottom>
                {title}
            </Typography>
            <Grid
                container
                className="fill-parent-height"
                component="div"
                justify="center"
                alignItems="flex-start"
            >
                {children}
            </Grid>
        </div>
    )
};

export default Header;
