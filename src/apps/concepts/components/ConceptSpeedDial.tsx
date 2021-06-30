import { Fab, Tooltip } from "@material-ui/core";
import { AddOutlined, EditOutlined, MoreVert } from "@material-ui/icons";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { APIOrg, APIProfile, canModifyContainer } from "../../authentication";
import { EditButton } from "../../containers/components/EditButton";
import { recursivelyAddConceptsToDictionaryAction } from "../../dictionaries";
import { APIConcept } from "../types";

interface Props {
  concept: APIConcept;
  conceptSource: string;
  ownerType: string;
  owner: string;
  linkedDictionary: string;
  dictionaryToAddTo: string;
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  conceptUrl: string;
  addConceptsToDictionary?: (
    ...args: Parameters<typeof recursivelyAddConceptsToDictionaryAction>
  ) => void;
}

export const ConceptSpeedDial: React.FC<Props> = ({
  concept,
  conceptSource,
  ownerType,
  owner,
  linkedDictionary,
  dictionaryToAddTo,
  profile,
  usersOrgs,
  conceptUrl,
  addConceptsToDictionary
}) => {
  const [open, setOpen] = useState(false);

  // we can modify the concept and it lives in our dictionary's linked source
  const showEditConceptButton =
    canModifyContainer(ownerType, owner, profile, usersOrgs) &&
    conceptSource &&
    concept?.url.includes(conceptSource);

  // if we are looking at a concept from an existing dictionary, we can add it
  // to our source
  const showAddConceptButton = (() => {
    if (!!!dictionaryToAddTo || !!!concept) {
      return false;
    }

    const [, ownerType, owner] = dictionaryToAddTo.split("/", 3);

    if (!!!ownerType || !!!owner) {
      return false;
    }

    return canModifyContainer(ownerType, owner, profile, usersOrgs);
  })();

  if (!showEditConceptButton && !showAddConceptButton) {
    return null;
  }

  if (!showAddConceptButton) {
    return (
      <EditButton
        url={`${conceptUrl}edit/?linkedDictionary=${linkedDictionary}`}
        title={`Edit ${concept.names ? concept.names[0].name : "concept"}`}
      />
    );
  } else if (!showAddConceptButton) {
    return (
      <Tooltip
        title={`Add ${
          concept.names ? concept.names[0].name : "concept"
        } to dictionary`}
        data-testid="addConceptToDictionaryIcon"
      >
        <Fab
          onClick={() =>
            addConceptsToDictionary &&
            addConceptsToDictionary( dictionaryToAddTo, [
              concept
            ],false, linkedDictionary)
            
          }
          color="primary"
          className="fab"
        >
          <AddOutlined />
        </Fab>
      </Tooltip>
    );
  }

  return (
    <SpeedDial
      ariaLabel="Concept Actions"
      className="fab"
      icon={<MoreVert />}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      open={open}
    >
      <SpeedDialAction
        key="edit_concept"
        icon={<EditOutlined />}
        tooltipTitle={`Edit ${
          concept.names ? concept.names[0].name : "concept"
        }`}
        onClick={() => {
          setOpen(false);
          return (
            <Redirect
              to={`${conceptUrl}edit/?linkedDictionary=${linkedDictionary}`}
            />
          );
        }}
      />
      <SpeedDialAction
        key="add_concept"
        icon={<AddOutlined />}
        tooltipTitle={`Add ${
          concept.names ? concept.names[0].name : "concept"
        } to dictionary`}
        onClick={() => {
          setOpen(false);
          addConceptsToDictionary &&
            addConceptsToDictionary( dictionaryToAddTo, [
              concept
            ],false, linkedDictionary);
        }}
      />
    </SpeedDial>
  );
};

export default ConceptSpeedDial;
