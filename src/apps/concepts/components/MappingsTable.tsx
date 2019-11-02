import {
  Button, createStyles,
  FormControl, IconButton, makeStyles, Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Theme,
  Typography
} from '@material-ui/core'
import { ArrayHelpers, ErrorMessage, Field } from 'formik'
import { Select, TextField } from 'formik-material-ui'
import { LOCALES, MAP_TYPES, NAME_TYPES, Option, OptionResponse } from '../../../utils'
import { MoreVert as MoreVertIcon } from '@material-ui/icons'
import React from 'react'
import { ConceptDescription, ConceptName, Mapping } from '../types'
import { AsyncSelect } from '../../../utils'
import api from '../api'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      verticalAlign: 'top',
    },
    singleCellWidth: {
      width: '32%',
    },
    menuItem: {
      width: '4%',
    },
    errorContainer: {
      textAlign: 'center',
    },
  }),
);

interface Props {
  valuesKey: string,
  values: Mapping[],
  errors?: {} | string,
  createNewValue: Function,
  arrayHelpers: ArrayHelpers,
  allowChoosingType?: boolean,
  useTypes?: boolean,
  isSubmitting: boolean,
}

const MappingsTable: React.FC<Props> = ({valuesKey, values, errors={}, createNewValue, arrayHelpers, allowChoosingType=false, useTypes=false, isSubmitting}) => {
  const classes = useStyles();

  const [menu, setMenu] = React.useState<{index: number, anchor: null | HTMLElement}>({index: -1, anchor: null});
  const toggleNameMenu = (index: number, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (index === menu.index) setMenu({index: -1, anchor: null});
    else if (event) setMenu({index: index, anchor: event.currentTarget});
  };

  const fetchSourceOptions = async (query: string, _:{}, {page}: {page: number}) => {
    try {
      const response = await api.retrievePublicSources(page, 10, query);
      const {data, headers: {next='None'}} = response;

      return {
        options: data.map(({name, url}: {name: string, url: string}) => ({label: name, value: url})),
        hasMore: next !== 'None',
        additional: {
          page: page+1,
        },
      };
    } catch (e) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: 1,
        },
      };
    }
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source</TableCell>
            <TableCell>Relationship</TableCell>
            <TableCell>Concept</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((name, index) => (
            <TableRow className={classes.row} key={index}>
              <TableCell className={classes.singleCellWidth} component="td" scope="row">
                <FormControl
                  fullWidth
                  margin="dense"
                >
                  <AsyncSelect placeholder="Select a source" value={''} onChange={(value: any) => console.log(value) } loadOptions={fetchSourceOptions} additional={{page: 1}}/>
                  {/*<Typography color="error" variant="caption" component="div">*/}
                  {/*  <ErrorMessage name={`${valuesKey}[${index}].to_source_url`} component="span"/>*/}
                  {/*</Typography>*/}
                </FormControl>
              </TableCell>
              <TableCell className={classes.singleCellWidth} component="td" scope="row">
                <FormControl
                  fullWidth
                  margin="dense"
                >
                  <Field
                    id={`${valuesKey}[${index}].map_type`}
                    name={`${valuesKey}[${index}].map_type`}
                    component={Select}
                  >
                    {MAP_TYPES.map(mapType => (
                      <MenuItem
                        key={mapType.value}
                        value={mapType.value}
                      >
                        {mapType.label}
                      </MenuItem>
                    ))}
                  </Field>
                  {/*<Typography color="error" variant="caption" component="div">*/}
                  {/*  <ErrorMessage name={`${valuesKey}[${index}].${type}_type`} component="span"/>*/}
                  {/*</Typography>*/}
                </FormControl>
              </TableCell>
              {/*<TableCell className={classes.singleCellWidth} component="td" scope="row">*/}
              {/*  <Field*/}
              {/*    fullWidth*/}
              {/*    id={`${valuesKey}[${index}].${type}`}*/}
              {/*    name={`${valuesKey}[${index}].${type}`}*/}
              {/*    margin="dense"*/}
              {/*    component={TextField}*/}
              {/*    multiline={allowChoosingType}*/}
              {/*  />*/}
              {/*</TableCell>*/}
              {/*{!useTypes ? null : (*/}

              {/*)}*/}
              {/*<TableCell className={classes.singleCellWidth} component="td" scope="row">*/}
              {/*  <FormControl*/}
              {/*    fullWidth*/}
              {/*    margin="dense"*/}
              {/*  >*/}
              {/*    <Field*/}
              {/*      id={`${valuesKey}[${index}].locale`}*/}
              {/*      name={`${valuesKey}[${index}].locale`}*/}
              {/*      component={Select}*/}
              {/*    >*/}
              {/*      {LOCALES.map(locale => <MenuItem key={locale.value} value={locale.value}>{locale.label}</MenuItem>)}*/}
              {/*    </Field>*/}
              {/*    <Typography color="error" variant="caption" component="div">*/}
              {/*      <ErrorMessage name={`${valuesKey}[${index}].locale`} component="span"/>*/}
              {/*    </Typography>*/}
              {/*  </FormControl>*/}
              {/*</TableCell>*/}
              {/*<TableCell className={classes.singleCellWidth} component="td" scope="row">*/}
              {/*  <FormControl*/}
              {/*    fullWidth*/}
              {/*    margin="dense"*/}
              {/*  >*/}
              {/*    <Field*/}
              {/*      id={`${valuesKey}[${index}].locale_preferred`}*/}
              {/*      name={`${valuesKey}[${index}].locale_preferred`}*/}
              {/*      component={Select}*/}
              {/*    >*/}
              {/*      <MenuItem*/}
              {/*        // @ts-ignore: some casting is done for us we don't need to worry about using booleans as values*/}
              {/*        value={false}*/}
              {/*      >*/}
              {/*        No*/}
              {/*      </MenuItem>*/}
              {/*      <MenuItem*/}
              {/*        // @ts-ignore*/}
              {/*        value={true}*/}
              {/*      >*/}
              {/*        Yes*/}
              {/*      </MenuItem>*/}
              {/*    </Field>*/}
              {/*    <Typography color="error" variant="caption" component="div">*/}
              {/*      <ErrorMessage name={`${valuesKey}[${index}].locale_preferred`} component="span"/>*/}
              {/*    </Typography>*/}
              {/*  </FormControl>*/}
              {/*</TableCell>*/}
              {/*<TableCell className={classes.menuItem} component="td" scope="row">*/}
              {/*  <IconButton id={`${valuesKey}[${index}].menu-icon`} aria-controls={`${valuesKey}[${index}].menu`} aria-haspopup="true" onClick={event => toggleNameMenu(index, event)}>*/}
              {/*    <MoreVertIcon />*/}
              {/*  </IconButton>*/}
              {/*  <Menu*/}
              {/*    anchorEl={menu.anchor}*/}
              {/*    id={`${valuesKey}[${index}].menu`}*/}
              {/*    open={index === menu.index}*/}
              {/*    onClose={() => toggleNameMenu(index)}*/}
              {/*  >*/}
              {/*    <MenuItem onClick={() => {arrayHelpers.remove(index); toggleNameMenu(index);}}>Delete</MenuItem>*/}
              {/*  </Menu>*/}
              {/*</TableCell>*/}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/*{typeof errors !== 'string' ? null : (*/}
      {/*  <Typography className={classes.errorContainer} color="error" variant="caption" component="div">*/}
      {/*    <ErrorMessage name={valuesKey} component="span"/>*/}
      {/*  </Typography>*/}
      {/*)}*/}
      {/*<br/>*/}
      {/*<Button variant="outlined" color="primary" size="small" disabled={isSubmitting} onClick={() => arrayHelpers.push(createNewValue())}>*/}
      {/*  Add {title}*/}
      {/*</Button>*/}
  </div>
  );
};


export default MappingsTable;
