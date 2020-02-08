import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography
} from "@material-ui/core";
import { ArrayHelpers, ErrorMessage, FormikTouched } from "formik";
import React, { useState } from "react";
import { Mapping } from "../types";
import MappingsTableRow from "./MappingsTableRow";
import { Option } from "../../../utils";
import {
  DeleteOutline as DeleteOutlineIcon,
  MoreVert as MenuIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorContainer: {
      textAlign: "center"
    }
  })
);

interface Props {
  valuesKey: string;
  values: Mapping[];
  errors?: {} | string;
  createNewMapping: Function;
  arrayHelpers: ArrayHelpers;
  isSubmitting: boolean;
  handleChange: Function;
  title: string;
  fixedMappingType?: Option;
  editing: boolean;
}

const HEADER_MENU_INDEX = -100;

const MappingsTable: React.FC<Props> = ({
  valuesKey,
  values,
  errors = {},
  createNewMapping,
  arrayHelpers,
  isSubmitting,
  handleChange,
  title,
  fixedMappingType,
  editing
}) => {
  const classes = useStyles();

  const [menu, setMenu] = React.useState<{
    index: number;
    anchor: null | HTMLElement;
  }>({ index: -1, anchor: null });
  const toggleMappingMenu = (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (index === menu.index) setMenu({ index: -1, anchor: null });
    else if (event) setMenu({ index: index, anchor: event.currentTarget });
  };

  const [showRetired, setShowRetired] = useState(false);
  const retiredCount = values.filter(value => value.retired).length;

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source</TableCell>
            {fixedMappingType ? null : <TableCell>Relationship</TableCell>}
            <TableCell>Concept</TableCell>
            <TableCell>
              {retiredCount < 1 ? null : (
                <IconButton
                  id={`${valuesKey}.menu-icon`}
                  aria-controls={`${valuesKey}.menu`}
                  aria-haspopup="true"
                  onClick={event => toggleMappingMenu(HEADER_MENU_INDEX, event)}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Menu
                anchorEl={menu.anchor}
                id={`${valuesKey}.menu`}
                open={HEADER_MENU_INDEX === menu.index}
                onClose={() => toggleMappingMenu(HEADER_MENU_INDEX)}
              >
                <MenuItem
                  onClick={() => {
                    setShowRetired(!showRetired);
                    toggleMappingMenu(HEADER_MENU_INDEX);
                  }}
                >{`${
                  showRetired
                    ? "Hide retired"
                    : "Show retired(" + retiredCount + ")"
                }`}</MenuItem>
              </Menu>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((value, index) =>
            value.retired && !showRetired ? null : (
              <MappingsTableRow
                key={index}
                value={value}
                index={index}
                valuesKey={valuesKey}
                handleChange={handleChange}
                toggleMenu={toggleMappingMenu}
                menu={menu}
                arrayHelpers={arrayHelpers}
                fixedMappingType={fixedMappingType}
                errors={Array.isArray(errors) ? errors[index] : undefined}
                editing={editing}
              />
            )
          )}
        </TableBody>
      </Table>
      {values.length > 0 ? null : (
        <Typography
          align="center"
          component="div"
        >{`No ${valuesKey}`}</Typography>
      )}
      {typeof errors !== "string" ? null : (
        <Typography
          className={classes.errorContainer}
          color="error"
          variant="caption"
          component="div"
        >
          <ErrorMessage name={valuesKey} component="span" />
        </Typography>
      )}
      <br />
      {!editing ? (
        ""
      ) : (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          disabled={isSubmitting}
          onClick={() => arrayHelpers.push(createNewMapping())}
        >
          Add {title}
        </Button>
      )}
    </div>
  );
};

export default MappingsTable;
