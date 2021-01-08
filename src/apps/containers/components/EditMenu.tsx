import {Button, Fab, Menu, MenuItem, Tooltip, makeStyles} from "@material-ui/core";
import {MoreVert as MenuIcon} from "@material-ui/icons";
import {Link} from "react-router-dom";
import React from "react";
import {useAnchor} from "../../../utils";

interface Props {
    backUrl: string;
    hasDelete?: boolean;
    openModal?: () => void;
}
const useStyles = makeStyles({
    deleteButton: {
        textTransform: 'capitalize',
        background: 'transparent',
        color: 'red'
    },  
});

export const EditMenu: React.FC<Props> = ({backUrl, hasDelete, openModal}: Props) => {
    const classes = useStyles();
    const [menuAnchor, handleMenuClick, handleMenuClose] = useAnchor();

    return (
        <>
            <Tooltip title="Menu">
                <Fab onClick={handleMenuClick} color="primary" className="fab">
                    <MenuIcon/>
                </Fab>
            </Tooltip>
            <Menu
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem>
                    <Link replace className="link" to={backUrl}>
                        Discard changes and view
                    </Link>
                </MenuItem>
                {hasDelete && 
                <MenuItem>
                    <Button onClick={openModal} className={classes.deleteButton}>
                        Delete Organisation
                    </Button>
                </MenuItem>
                }
            </Menu>

        </>
    )
};