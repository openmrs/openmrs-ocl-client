import React from 'react';
import {
    Button,
    CssBaseline, Dialog, DialogActions, DialogTitle,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem, ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import {Menu, ExitToApp, FolderOpenOutlined, FolderSharedOutlined, HomeOutlined} from '@material-ui/icons';
import './NavDrawer.css';
import {connect} from "react-redux";
import {logoutAction} from "./apps/authentication";
import {Link} from "react-router-dom";


interface Props {
    children: any,
    logout: Function,
}

export const NavDrawer: React.FC<Props> = ({children, logout}) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [confirmLogoutOpen, setConfirmLogoutOpen] = React.useState(false);

    const toggleDrawer = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div id="main">
            <CssBaseline />
            <Drawer id="drawer" variant="permanent">
                <div id="menu-icon">
                    <IconButton onClick={toggleDrawer}>
                        <Menu/>
                    </IconButton>
                </div>
                <Divider component="hr"/>
                <List component="div">
                    <ListItem button disableGutters={!menuOpen} dense={false} component={Link} to="/" key="Home">
                        <ListItemIcon className="list-item-icon"><HomeOutlined/></ListItemIcon>
                        {menuOpen ? <ListItemText primary="Home" /> : <div/>}
                    </ListItem>
                </List>
                <Divider component="hr"/>
                <List component="div">
                    <ListItem button disableGutters={!menuOpen} dense={false} component={Link} to="/user/dictionaries/" key="Your Dictionaries">
                        <ListItemIcon className="list-item-icon"><FolderOpenOutlined/></ListItemIcon>
                        {menuOpen ? <ListItemText primary="Your Dictionaries" /> : <div/>}
                    </ListItem>
                    <ListItem button disableGutters={!menuOpen} dense={false} component={Link} to="/dictionaries/" key="Public Dictionaries">
                        <ListItemIcon className="list-item-icon"><FolderSharedOutlined/></ListItemIcon>
                        {menuOpen ? <ListItemText primary="Public Dictionaries" /> : <div/>}
                    </ListItem>
                </List>
                <Divider component="hr"/>
                <div id="logout-icon">
                    <Divider component="hr"/>
                    <List component="div">
                        <ListItem onClick={() => setConfirmLogoutOpen(true)} button disableGutters={!menuOpen} component="div" key={"Logout"}>
                            <ListItemIcon className="list-item-icon"><ExitToApp /></ListItemIcon>
                            {menuOpen ? <ListItemText primary="Logout" /> : <div/>}
                        </ListItem>
                    </List>
                    <Dialog
                        maxWidth="xs"
                        aria-labelledby="confirmation-dialog-title"
                        open={confirmLogoutOpen}
                        onClose={() => setConfirmLogoutOpen(false)}
                    >
                        <DialogTitle id="confirmation-dialog-title">Confirm Logout</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => setConfirmLogoutOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => logout()} color="secondary">
                                Logout
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Drawer>
            <main>
                {children}
            </main>
        </div>
    );
};

const mapDispatchToProps = {logout: logoutAction};

export default connect(undefined, mapDispatchToProps)(NavDrawer);
