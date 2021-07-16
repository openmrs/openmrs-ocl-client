import React, { useState, useEffect } from "react";
import {
  createStyles,
  Grid,
  Input,
  InputAdornment,
  makeStyles,
  Theme
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Search as SearchIcon } from "@material-ui/icons";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { VERIFIED_SOURCES } from "../../../utils";
import { VerifiedSource } from "../../../components/VerifiedSource";

interface Props {
  title: string;
  onSearch: Function;
  initialQ: string;
  showOnlyVerified: boolean;
  toggleShowVerified: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: "2vw"
    },
    searchInput: {
      textAlign: "center",
      fontSize: "larger"
    },
    searchContainer: {
      justifyItems: "center",
      display: "grid",
      position: "sticky",
      background: "transparent",
      width: "100%",
      margin: theme.spacing(2),
      padding: theme.spacing(2)
    }
  })
);

const ContainerSearch: React.FC<Props> = ({
  title,
  onSearch,
  initialQ,
  showOnlyVerified,
  toggleShowVerified
}) => {
  const classes = useStyles();
  const [q, setQ] = useState(initialQ);

  useEffect(
    () => (showOnlyVerified ? onSearch(VERIFIED_SOURCES[0]) : onSearch()),
    [showOnlyVerified, onSearch]
  );

  return (
    <Grid className={classes.searchContainer} item xs={12}>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSearch(q);
        }}
      >
        <Input
          inputProps={{
            className: classes.searchInput
          }}
          onChange={e => setQ(e.target.value)}
          value={q}
          color="secondary"
          type="search"
          fullWidth
          placeholder={`Search ${title}`}
          data-testid="searchInput"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => onSearch(q)}
                data-testid="searchButton"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </form>
      <FormControlLabel
        control={
          <Switch
            checkedIcon={<VerifiedSource />}
            checked={showOnlyVerified}
            onChange={toggleShowVerified}
            color="primary"
            name="displayVerified"
          />
        }
        label={
          showOnlyVerified ? "Showing verified only" : "Showing all results"
        }
      />
    </Grid>
  );
};

export default ContainerSearch;
