import React, { useState } from "react";
import {
  createStyles,
  Grid,
  Input,
  InputAdornment,
  makeStyles,
  Theme,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Search as SearchIcon } from "@material-ui/icons";
import { VerifiedUser } from "@material-ui/icons";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { VERIFIED_SOURCES } from "../../../utils";

interface Props {
  title: string;
  onSearch: Function;
  initialQ: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: "2vw",
    },
    searchInput: {
      textAlign: "center",
      fontSize: "larger",
    },
    searchContainer: {
      justifyItems: "center",
      display: "grid",
      position: "sticky",
      background: "transparent",
      width: "100%",
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    flex: {
      display: "flex",
    },
  })
);

const ContainerSearch: React.FC<Props> = ({ title, onSearch, initialQ }) => {
  const classes = useStyles();
  const [q, setQ] = useState(initialQ);
  const [state, setState] = React.useState({
    displayVerified: false,
  });
  const handleChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    return event.target.checked ? onSearch(VERIFIED_SOURCES.CIEL) : onSearch();
  };
  return (
    <Grid className={classes.searchContainer} item xs={12}>
      <div className={classes.flex}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(q);
          }}
        >
          <Input
            inputProps={{
              className: classes.searchInput,
            }}
            onChange={(e) => setQ(e.target.value)}
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
              checkedIcon={<VerifiedUser />}
              checked={state.displayVerified}
              onChange={handleChange}
              color="primary"
              name="displayVerified"
            />
          }
          label={
            state.displayVerified
              ? "Showing verified only"
              : "Showing all results"
          }
        />
      </div>
    </Grid>
  );
};

export default ContainerSearch;
