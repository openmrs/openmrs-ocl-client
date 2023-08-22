import React from "react";
import { APIConcept } from "../types";
import {
  TableRow,
  TableCell,
  Checkbox,
  Tooltip,
  IconButton
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ConceptsActionMenu } from "./ConceptsActionMenu";
import { AlreadyAddedIcon } from "./AlreadyAddedIcon";

export function showEditMenuItem(
  concept: APIConcept,
  showingEditButtons: boolean,
  linkedSource: string | undefined,
  canModifyConcept: (concept: APIConcept) => boolean
) {
  // only allow edit of a concept we can modify and belongs to our linked source
  // the second condition prevents us editing non custom concepts in a collection
  return (
    showingEditButtons &&
    canModifyConcept(concept) &&
    linkedSource &&
    concept.url.includes(linkedSource)
  );
}

export function showRemoveFromDictionaryMenuItem(
  concept: APIConcept,
  showingEditButtons: boolean,
  linkedSource: string | undefined
) {
  // only allow manual removal of imported/ non custom concepts
  return (
    showingEditButtons && linkedSource && !concept.url.includes(linkedSource)
  );
}
/*
  Show the action icon only when the concept has 
  atleast one of the 3 options - edit, remove or add to Dictionary
  */
export function showActionIcon(
  concept: APIConcept,
  buttons: { [key: string]: boolean },
  linkedSource: string | undefined,
  canModifyConcept: (concept: APIConcept) => boolean
) {
  return (
    showEditMenuItem(concept, buttons.edit, linkedSource, canModifyConcept) ||
    showRemoveFromDictionaryMenuItem(concept, buttons.edit, linkedSource) ||
    buttons.addToDictionary
  );
}

const actionIcon = (
  index: number,
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void
) => {
  return (
    <Tooltip title="More actions" enterDelay={700}>
      <IconButton
        data-testid={"action-icon"}
        id={`${index}.menu-icon`}
        aria-controls={`${index}.menu`}
        aria-haspopup="true"
        onClick={event => toggleMenu(index, event)}
      >
        <MoreVertIcon />
      </IconButton>
    </Tooltip>
  );
};

const conceptNameCell = (
  toggleSelect: (event: React.MouseEvent<unknown>, uuid: string) => void,
  row: APIConcept,
  linkedDictionary?: string,
  dictionaryToAddTo?: string
) => {
  let link = row.version_url;
  const params = new URLSearchParams();
  if (linkedDictionary) {
    params.append("linkedDictionary", linkedDictionary);
  }

  if (dictionaryToAddTo) {
    params.append("dictionaryToAddTo", dictionaryToAddTo);
  }

  const queryString = params.toString();
  link = queryString ? row.version_url + "?" + queryString : row.version_url;

  return (
    <TableCell
      onClick={event => toggleSelect(event, row.uuid || "")}
      data-testclass="name"
      className={row.retired ? "retired" : ""}
      style={{ wordBreak: "break-all" }}
    >
      <Link onClick={e => e.stopPropagation()} to={link}>
        {row.display_name}
      </Link>
    </TableCell>
  );
};

const conceptClassCell = (
  toggleSelect: (event: React.MouseEvent<unknown>, uuid: string) => void,
  row: APIConcept
) => {
  return (
    <TableCell
      onClick={event => toggleSelect(event, row.uuid || "")}
      data-testclass="conceptClass"
      style={{ wordWrap: "break-word" }}
    >
      {row.concept_class}
    </TableCell>
  );
};

const conceptDataTypeCell = (
  toggleSelect: (event: React.MouseEvent<unknown>, uuid: string) => void,
  row: APIConcept
) => {
  return (
    <TableCell
      onClick={event => toggleSelect(event, row.uuid || "")}
      data-testclass="datatype"
      style={{ wordWrap: "break-word" }}
    >
      {row.datatype}
    </TableCell>
  );
};

const conceptSourceCell = (
  toggleSelect: (event: React.MouseEvent<unknown>, uuid: string) => void,
  row: APIConcept
) => {
  return (
    <TableCell
      onClick={event => toggleSelect(event, row.uuid || "")}
      data-testclass="source"
      style={{ wordWrap: "break-word" }}
    >
      {row.source}
    </TableCell>
  );
};

const conceptIDCell = (
  toggleSelect: (event: React.MouseEvent<unknown>, uuid: string) => void,
  row: APIConcept
) => {
  return (
    <TableCell
      onClick={event => toggleSelect(event, row.uuid || "")}
      style={{ wordBreak: "break-all" }}
    >
      {row.id}
    </TableCell>
  );
};

const checkBoxCell = (
  toggleSelect: (event: React.MouseEvent<unknown>, id: string) => void,
  row: APIConcept,
  isItemSelected: boolean,
  labelId: string
) => {
  return (
    <TableCell padding="checkbox">
      <Checkbox
        // ideally, we would have made this apply to the entire row, but there
        // seems to be a problem with an implicit click when the row popup closes
        onClick={event => toggleSelect(event, row.id)}
        checked={isItemSelected}
        inputProps={{ "aria-labelledby": labelId }}
        color="secondary"
      />
    </TableCell>
  );
};

const actionCell = (
  row: APIConcept,
  buttons: { [key: string]: boolean },
  canModifyConcept: (concept: APIConcept) => boolean,
  index: number,
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void,
  menu: { index: number; anchor: null | HTMLElement },
  removeConceptsFromDictionary: (conceptUrls: string[]) => void,
  addConceptsToDictionary: Function,

  linkedSource: string | undefined,
  linkedDictionary: string | undefined
) => {
  return (
    <TableCell padding="checkbox">
      {!showActionIcon(row, buttons, linkedSource, canModifyConcept)
        ? null
        : actionIcon(index, toggleMenu)}
      <ConceptsActionMenu
        index={index}
        row={row}
        buttons={buttons}
        toggleMenu={toggleMenu}
        menu={menu}
        canModifyConcept={canModifyConcept}
        removeConceptsFromDictionary={removeConceptsFromDictionary}
        addConceptsToDictionary={addConceptsToDictionary}
        linkedSource={linkedSource}
        linkedDictionary={linkedDictionary}
      />
    </TableCell>
  );
};

const AlreadyCheckedCell = () => (
  <TableCell padding="checkbox">
    <AlreadyAddedIcon />
  </TableCell>
);

interface ConceptsTableRowProps {
  row: APIConcept;
  index: number;
  selected: string[];
  toggleSelect: (event: React.MouseEvent<unknown>, uuid: string) => void;
  linkedDictionary?: string;
  buttons: { [key: string]: boolean };
  linkedSource: string | undefined;
  canModifyConcept: (concept: APIConcept) => boolean;
  toggleMenu: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => void;
  menu: { index: number; anchor: null | HTMLElement };
  removeConceptsFromDictionary: (conceptUrls: string[]) => void;
  addConceptsToDictionary: Function;
  dictionaryToAddTo?: string;
  isItemSelected: boolean;
  labelId: string;
}

export function ConceptsTableRow(props: ConceptsTableRowProps) {
  const {
    row,
    index,
    selected,
    toggleSelect,
    linkedDictionary,
    buttons,
    linkedSource,
    canModifyConcept,
    toggleMenu,
    menu,
    removeConceptsFromDictionary,
    addConceptsToDictionary,
    dictionaryToAddTo,
    isItemSelected,
    labelId
  } = props;
  return (
    <TableRow
      hover
      data-testrowclass="conceptRow"
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={`${row.id}-${index}`}
      selected={isItemSelected}
      className={row?.added ? "added" : ""}
      style={
        row?.added
          ? { backgroundColor: "#bbc5fb" }
          : { backgroundColor: "none" }
      }
    >
      {selected.length <= 0
        ? null
        : checkBoxCell(toggleSelect, row, isItemSelected, labelId)}
      {conceptNameCell(toggleSelect, row, linkedDictionary, dictionaryToAddTo)}
      {conceptClassCell(toggleSelect, row)}
      {conceptDataTypeCell(toggleSelect, row)}
      {conceptSourceCell(toggleSelect, row)}
      {conceptIDCell(toggleSelect, row)}
      {row.added
        ? AlreadyCheckedCell()
        : actionCell(
            row,
            buttons,
            canModifyConcept,
            index,
            toggleMenu,
            menu,
            removeConceptsFromDictionary,
            addConceptsToDictionary,
            linkedSource,
            linkedDictionary
          )}
    </TableRow>
  );
}
