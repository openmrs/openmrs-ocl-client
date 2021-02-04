import React from "react";
import {
    Fab,
    Tooltip
} from "@material-ui/core";
import {APIConcept} from "../types";
import {Add as AddIcon} from "@material-ui/icons";

interface AddConceptToDictionaryIconProps {
    dictionaryToAddTo?:string;
    canAddConcept:string;
    concept?:APIConcept;
    addConceptsToDictionary: Function;
}

export function AddConceptToDictionaryIcon(props: AddConceptToDictionaryIconProps) {
  const {
      dictionaryToAddTo,
      canAddConcept,
      concept,
      addConceptsToDictionary
  } = props;
return (canAddConcept==="false"  || dictionaryToAddTo===undefined || dictionaryToAddTo===null )? (null):
  (
    <Tooltip title="Add concept to Dictionary" data-testid="addConceptToDictionaryIcon">
      <Fab onClick={() => {
                    if (addConceptsToDictionary){ 
                      addConceptsToDictionary([concept]);
                    };
                  }} color="primary" className="fab">    
        <AddIcon/>
      </Fab>
    </Tooltip>
  )
};

export default AddConceptToDictionaryIcon;
