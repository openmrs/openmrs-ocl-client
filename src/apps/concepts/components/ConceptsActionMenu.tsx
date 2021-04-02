import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { APIConcept } from "../types";
import {
  showEditMenuItem,
  showRemoveFromDictionaryMenuItem
} from "./ConceptsTableRow";
import { Link } from "react-router-dom";
import {
  Add as AddIcon,
  DeleteSweepOutlined as DeleteIcon,
  EditOutlined as EditIcon
} from "@material-ui/icons";

const addConceptsToDictionaryMenu = (
  addConceptsToDictionary: Function,
  row: APIConcept,
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void,
  index: number
) => {
  return (
    <MenuItem
      onClick={() => {
        if (addConceptsToDictionary) addConceptsToDictionary([row]);
        toggleMenu(index);
      }}
    >
      <AddIcon /> Add to dictionary
    </MenuItem>
  );
};

const removeConceptsFromDictionaryMenu = (
  removeConceptsFromDictionary: (conceptVersionUrls: string[]) => void,
  row: APIConcept,
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void,
  index: number
) => {
  return (
    <MenuItem
      onClick={() => {
        if (removeConceptsFromDictionary)
          removeConceptsFromDictionary([row.version_url]);
        toggleMenu(index);
      }}
    >
      <DeleteIcon /> Remove
    </MenuItem>
  );
};

const editConceptMenu = (
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void,
  index: number,
  row: APIConcept,
  linkedDictionary: string | undefined
) => {
  return (
    <MenuItem onClick={() => toggleMenu(index)}>
      <Link
        className="buttonLink"
        to={`${row.version_url}edit/?linkedDictionary=${linkedDictionary}`}
      >
        <EditIcon /> Edit
      </Link>
    </MenuItem>
  );
};

const addMenu = (
  index: number,
  row: APIConcept,
  buttons: { [key: string]: boolean },
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void,
  addConceptsToDictionary: Function
) => {
  return !buttons.addToDictionary
    ? null
    : addConceptsToDictionaryMenu(
        addConceptsToDictionary,
        row,
        toggleMenu,
        index
      );
};

const removeMenu = (
  index: number,
  row: APIConcept,
  buttons: { [key: string]: boolean },
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void,
  linkedSource: string | undefined,
  removeConceptsFromDictionary: (conceptVersionUrls: string[]) => void
) => {
  return !showRemoveFromDictionaryMenuItem(row, buttons.edit, linkedSource)
    ? null
    : removeConceptsFromDictionaryMenu(
        removeConceptsFromDictionary,
        row,
        toggleMenu,
        index
      );
};

const editMenu = (
  index: number,
  row: APIConcept,
  buttons: { [key: string]: boolean },
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void,
  canModifyConcept: (concept: APIConcept) => boolean,
  linkedSource: string | undefined,
  linkedDictionary: string | undefined
) => {
  return !showEditMenuItem(row, buttons.edit, linkedSource, canModifyConcept)
    ? null
    : editConceptMenu(toggleMenu, index, row, linkedDictionary);
};

interface ConceptsActionMenuProps {
  index: number;
  row: APIConcept;
  buttons: { [key: string]: boolean };
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void;
  menu: { index: number; anchor: null | HTMLElement };
  canModifyConcept: (concept: APIConcept) => boolean;
  removeConceptsFromDictionary: (conceptVersionUrls: string[]) => void;
  addConceptsToDictionary: Function;
  linkedSource: string | undefined;
  linkedDictionary: string | undefined;
}

export function ConceptsActionMenu(props: ConceptsActionMenuProps) {
  const {
    index,
    row,
    buttons,
    toggleMenu,
    menu,
    canModifyConcept,
    removeConceptsFromDictionary,
    addConceptsToDictionary,
    linkedSource,
    linkedDictionary
  } = props;
  return (
    <Menu
      anchorEl={menu.anchor}
      id={`${index}.menu`}
      open={index === menu.index}
      onClose={() => toggleMenu(index)}
    >
      {editMenu(
        index,
        row,
        buttons,
        toggleMenu,
        canModifyConcept,
        linkedSource,
        linkedDictionary
      )}
      {removeMenu(
        index,
        row,
        buttons,
        toggleMenu,
        linkedSource,
        removeConceptsFromDictionary
      )}
      {addMenu(index, row, buttons, toggleMenu, addConceptsToDictionary)}
    </Menu>
  );
}

export default ConceptsActionMenu;
