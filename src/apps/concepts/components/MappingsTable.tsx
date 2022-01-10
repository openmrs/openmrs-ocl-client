import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography
} from "@mui/material";
import { ArrayHelpers, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { Mapping } from "../types";
import MappingsTableRow from "./MappingsTableRow";
import { Option } from "../../../utils";
import { MoreVert as MenuIcon } from "@mui/icons-material";
import { DragHandle } from "../../../components/DragHandle";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorContainer: {
      textAlign: "center"
    },
    tableContainer: {
      paddingBottom: "250px",
      marginBottom: "-250px"
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
  submitCount: number;
  handleChange: Function;
  title: string;
  fixedMappingType?: Option;
  editing: boolean;
}

const HEADER_MENU_INDEX = -100;

const buildEvent = (name: string, value: any) => ({
  target: { name, value }
});

const MappingsTable: React.FC<Props> = ({
  valuesKey,
  values,
  errors = {},
  createNewMapping,
  arrayHelpers,
  isSubmitting,
  submitCount,
  handleChange,
  title,
  fixedMappingType,
  editing
}) => {
  const classes = useStyles();
  const [sorted, setSorted] = useState<Mapping[]>();
  const [allowReordering, setAllowReordering] = useState(false);

  useEffect(
    () => setAllowReordering(title === "Answer" || title === "Set Members"),
    [title]
  );

  useEffect(() => {
    if (sorted && allowReordering) {
      const values = sorted;
      values.sort((v1, v2) => {
        if (v1.extras?.sort_weight) {
          if (v2.extras?.sort_weight) {
            return (
              (v1.extras.sort_weight as number) -
              (v2.extras.sort_weight as number)
            );
          }

          return 1;
        }

        if (v2.extras?.sort_weight) {
          return -1;
        }

        return 0;
      });
      setSorted(values);
    }
  }, [sorted, allowReordering]);

  useEffect(() => {
    if (allowReordering && isSubmitting) {
      for (let i = 0; i < values.length; i++) {
        handleChange(
          buildEvent(`${valuesKey}[${i}].extras`, { sort_weight: i + 1 })
        );
      }
    }
  }, [
    allowReordering,
    isSubmitting,
    submitCount,
    handleChange,
    values.length,
    valuesKey
  ]);

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
  const noValuesKeyLabel = () => {
    switch (valuesKey) {
      case "sets":
        return "No set members";
      default:
        return `No ${valuesKey}`;
    }
  };
  const noMappingsMsg = () => {
    if (values.length <= 0) {
      return (
        <Typography align="center" component="div">
          {noValuesKeyLabel()}
        </Typography>
      );
    }
  };

  return (
    <div>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader>
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
                    onClick={event =>
                      toggleMappingMenu(HEADER_MENU_INDEX, event)
                    }
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
          {allowReordering && editing ? (
            <DragDropContext
              onDragEnd={param => {
                const srcI = param.source.index;
                const desI = param.destination?.index;
                if (desI) {
                  values.splice(desI, 0, values.splice(srcI, 1)[0]);
                }
              }}
            >
              <TableBody>
                <Droppable droppableId="droppable-1">
                  {(provided, _) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {values.map((value, index) =>
                        value.retired && !showRetired ? null : (
                          <Draggable
                            key={value.external_id}
                            draggableId={"draggable-" + value.external_id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  boxShadow: snapshot.isDragging
                                    ? "0 0 .4rem #666"
                                    : "none",
                                  display: "flex"
                                }}
                              >
                                <DragHandle {...provided.dragHandleProps} />
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
                                  errors={
                                    Array.isArray(errors)
                                      ? errors[index]
                                      : undefined
                                  }
                                  editing={editing}
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </TableBody>
            </DragDropContext>
          ) : (
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
          )}
        </Table>
        {noMappingsMsg()}
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
      </TableContainer>
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
