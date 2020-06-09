import {
  Button,
  createStyles,
  FormControl,
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
import { ArrayHelpers, ErrorMessage, Field } from "formik";
import { Select, TextField } from "formik-material-ui";
import { NAME_TYPES } from "../../../utils";
import {
  DeleteOutline as DeleteOutlineIcon,
  MoreVert as MoreVertIcon
} from "@material-ui/icons";
import React from "react";
import { ConceptDescription, ConceptName } from "../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      verticalAlign: "top"
    },
    singleCellWidth: {
      width: "24%"
    },
    doubleCellWidth: {
      width: "48%"
    },
    menuItem: {
      width: "4%"
    },
    errorContainer: {
      textAlign: "center"
    }
  })
);

interface Props {
  type: string;
  title: string;
  valuesKey: string;
  values: (ConceptName | ConceptDescription)[];
  errors?: {} | string;
  createNewValue: Function;
  arrayHelpers: ArrayHelpers;
  multiline?: boolean;
  useTypes?: boolean;
  isSubmitting: boolean;
  editing: boolean;
  supportedLocales: { [key: string]: string }[];
}

const NamesTable: React.FC<Props> = ({
  valuesKey,
  type,
  title,
  values,
  errors = {},
  createNewValue,
  arrayHelpers,
  multiline = false,
  useTypes = false,
  isSubmitting,
  editing,
  supportedLocales
}) => {
  const classes = useStyles();

  const [menu, setMenu] = React.useState<{
    index: number;
    anchor: null | HTMLElement;
  }>({ index: -1, anchor: null });

  const toggleNameMenu = (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (index === menu.index) setMenu({ index: -1, anchor: null });
    else if (event) setMenu({ index: index, anchor: event.currentTarget });
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{title}</TableCell>
            {useTypes ? <TableCell>Type</TableCell> : null}
            <TableCell>Language</TableCell>
            <TableCell>Preferred in language</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((value, index) => (
            <TableRow className={classes.row} key={index}>
              <TableCell
                className={
                  multiline ? classes.doubleCellWidth : classes.singleCellWidth
                }
                component="td"
                scope="row"
              >
                <Field
                  fullWidth
                  id={`${valuesKey}[${index}].${type}`}
                  name={`${valuesKey}[${index}].${type}`}
                  data-testid={`${valuesKey}_${index}_${type}`}
                  margin="dense"
                  component={TextField}
                  multiline={multiline}
                />
              </TableCell>
              {!useTypes ? null : (
                <TableCell
                  className={classes.singleCellWidth}
                  component="td"
                  scope="row"
                >
                  <FormControl fullWidth margin="dense">
                    <Field
                      id={`${valuesKey}[${index}].${type}_type`}
                      name={`${valuesKey}[${index}].${type}_type`}
                      data-testid={`${valuesKey}_${index}_${type}_type`}
                      component={Select}
                    >
                      {NAME_TYPES.map(nameType => (
                        <MenuItem key={nameType.value} value={nameType.value}>
                          {nameType.label}
                        </MenuItem>
                      ))}
                    </Field>
                    <Typography color="error" variant="caption" component="div">
                      <ErrorMessage
                        name={`${valuesKey}[${index}].${type}_type`}
                        component="span"
                      />
                    </Typography>
                  </FormControl>
                </TableCell>
              )}
              <TableCell
                className={classes.singleCellWidth}
                component="td"
                scope="row"
              >
                <FormControl fullWidth margin="dense">
                  <Field
                    id={`${valuesKey}[${index}].locale`}
                    name={`${valuesKey}[${index}].locale`}
                    data-testid={`${valuesKey}_${index}_locale`}
                    component={Select}
                  >
                    {supportedLocales.map(locale => (
                      <MenuItem key={locale.value} value={locale.value}>
                        {locale.label}
                      </MenuItem>
                    ))}
                  </Field>
                  <Typography color="error" variant="caption" component="div">
                    <ErrorMessage
                      name={`${valuesKey}[${index}].locale`}
                      component="span"
                    />
                  </Typography>
                </FormControl>
              </TableCell>
              <TableCell
                className={classes.singleCellWidth}
                component="td"
                scope="row"
              >
                <FormControl fullWidth margin="dense">
                  <Field
                    id={`${valuesKey}[${index}].locale_preferred`}
                    name={`${valuesKey}[${index}].locale_preferred`}
                    data-testid={`${valuesKey}_${index}_locale_preferred`}
                    component={Select}
                  >
                    <MenuItem
                      // @ts-ignore: some casting is done for us we don't need to worry about using booleans as values
                      value={false}
                    >
                      No
                    </MenuItem>
                    <MenuItem
                      // @ts-ignore
                      value={true}
                    >
                      Yes
                    </MenuItem>
                  </Field>
                  <Typography color="error" variant="caption" component="div">
                    <ErrorMessage
                      name={`${valuesKey}[${index}].locale_preferred`}
                      component="span"
                    />
                  </Typography>
                </FormControl>
              </TableCell>
              <TableCell
                className={classes.menuItem}
                component="td"
                scope="row"
              >
                {!editing ? (
                  ""
                ) : (
                  <IconButton
                    id={`${valuesKey}[${index}].menu-icon`}
                    aria-controls={`${valuesKey}[${index}].menu`}
                    aria-haspopup="true"
                    onClick={event => toggleNameMenu(index, event)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
                <Menu
                  anchorEl={menu.anchor}
                  id={`${valuesKey}[${index}].menu`}
                  open={index === menu.index}
                  onClose={() => toggleNameMenu(index)}
                >
                  <MenuItem
                    onClick={() => {
                      arrayHelpers.remove(index);
                      toggleNameMenu(index);
                    }}
                  >
                    <DeleteOutlineIcon /> Delete
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
          onClick={() => arrayHelpers.push(createNewValue())}
        >
          Add {title}
        </Button>
      )}
    </div>
  );
};

export default NamesTable;
