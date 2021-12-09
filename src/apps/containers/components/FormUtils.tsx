import { ListSubheader, MenuItem } from "@mui/material";
import React from "react";
import { APIOrg, APIProfile } from "../../authentication";
import { BaseConceptContainer, LOCALES } from "../../../utils";

export const showUserName = (profile: APIProfile | undefined) => {
  return profile ? (
    <MenuItem value={profile.url}>{profile.username}(You)</MenuItem>
  ) : null;
};

export const showOrganisationHeader = (userOrgs: APIOrg[]) => {
  return userOrgs.length > 0 ? (
    <ListSubheader>Your Organizations</ListSubheader>
  ) : null;
};

export const showUserOrganisations = (userOrgs: APIOrg[]) => {
  return userOrgs.length > 0
    ? userOrgs.map(org => (
        <MenuItem key={org.id} value={org.url}>
          {org.name}
        </MenuItem>
      ))
    : null;
};

function pushLocale(labels: Array<JSX.Element>, value: string, label: string) {
  return labels.push(
    <MenuItem key={value} value={value} style={{ whiteSpace: "normal" }}>
      {label}
    </MenuItem>
  );
}

export const supportedLocalesLabel = (
  values: BaseConceptContainer | { default_locale: string }
) => {
  const labels: Array<JSX.Element> = [];
  LOCALES.filter(
    ({ value }) => value !== values.default_locale
  ).map(({ value, label }) => pushLocale(labels, value, label));
  return labels;
};

export function showDefaultLocale() {
  const labels: Array<JSX.Element> = [];
  LOCALES.map(({ value, label }) => pushLocale(labels, value, label));
  return labels;
}
