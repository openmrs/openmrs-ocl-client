import { AddOutlined, EditOutlined, MoreVert } from "@material-ui/icons";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { CopyContentIcon } from "../../../components/CopyContentIcon";
import { APIOrg, APIProfile, canModifyContainer } from "../../authentication";
import { CloneButton } from "../../containers/components/CloneButton";
import { EditButton } from "../../containers/components/EditButton";
import { recursivelyAddConceptsToDictionaryAction } from "../../dictionaries/redux";
import { cloneConceptToDictionaryAction } from "../redux";
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
  cloneConceptToDictionary?: (
    ...args: Parameters<typeof cloneConceptToDictionaryAction>
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
  addConceptsToDictionary,
  cloneConceptToDictionary
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

  if (!showEditConceptButton && !showAddConceptButton && !dictionaryToAddTo) {
    return null;
  }

  if (showEditConceptButton && !showAddConceptButton && !dictionaryToAddTo) {
    return (
      <EditButton
        title={`Edit ${concept.names ? concept.names[0].name : "concept"}`}
        url={`${conceptUrl}edit/${
          linkedDictionary !== undefined
            ? "?linkedDictionary=" + linkedDictionary
            : ""
        }`}
      />
    );
  } else if (!showAddConceptButton && dictionaryToAddTo) {
    return (
      <CloneButton
        title={`Clone ${
          concept.names ? concept.names[0].name : "concept"
        } to dictionary`}
        onClick={e => {
          e.preventDefault();
          // TODO prompt for new concept id if necessary
          cloneConceptToDictionary &&
            cloneConceptToDictionary(dictionaryToAddTo, concept);
        }}
      />
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
      {showEditConceptButton && (
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
                to={`${conceptUrl}edit/${
                  linkedDictionary !== undefined
                    ? "?linkedDictionary=" + linkedDictionary
                    : ""
                }`}
              />
            );
          }}
        />
      )}
      {showAddConceptButton && (
        <SpeedDialAction
          key="add_concept"
          icon={<AddOutlined />}
          tooltipTitle={`Add ${
            concept.names ? concept.names[0].name : "concept"
          } to dictionary`}
          onClick={() => {
            setOpen(false);
            addConceptsToDictionary &&
              addConceptsToDictionary(
                dictionaryToAddTo,
                [concept],
                false,
                linkedDictionary
              );
          }}
        />
      )}
      {dictionaryToAddTo && (
        <SpeedDialAction
          key="clone_concept"
          icon={<CopyContentIcon />}
          tooltipTitle={`Clone ${
            concept.names ? concept.names[0].name : "concept"
          } to dictionary`}
          onClick={() => {
            setOpen(false);
            cloneConceptToDictionary &&
              cloneConceptToDictionary(dictionaryToAddTo, concept);
          }}
        />
      )}
    </SpeedDial>
  );
};

export default ConceptSpeedDial;
