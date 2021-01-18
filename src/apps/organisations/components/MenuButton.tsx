import {Fab, Menu, MenuItem, Tooltip} from "@material-ui/core";
import {MoreVert as MenuIcon, DeleteSweepOutlined as DeleteIcon,} from "@material-ui/icons";
import {Link} from "react-router-dom";
import React from "react";
import {useAnchor} from "../../../utils";

interface Props {
    backUrl: string;
    confirmDelete?: () => void;
}

export const MenuButton: React.FC<Props> = ({backUrl, confirmDelete}: Props) => {
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
                <MenuItem onClick={confirmDelete}>
                  <DeleteIcon />
                  Delete Organisation
                </MenuItem>
            </Menu>

        </>
    )
};
