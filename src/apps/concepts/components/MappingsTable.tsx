import {
  Button,
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Theme,
  Typography
} from '@material-ui/core'
import { ArrayHelpers, ErrorMessage } from 'formik'
import React from 'react'
import { Mapping } from '../types'
import MappingsTableRow from './MappingsTableRow'
import { Option } from '../../../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorContainer: {
      textAlign: 'center',
    },
  }),
);

interface Props {
  valuesKey: string,
  values: Mapping[],
  errors?: {} | string,
  createNewMapping: Function,
  arrayHelpers: ArrayHelpers,
  allowChoosingType?: boolean,
  useTypes?: boolean,
  isSubmitting: boolean,
  handleChange: Function,
  title: string,
  fixedMappingType?: Option,
}

const MappingsTable: React.FC<Props> = ({valuesKey, values, errors={}, createNewMapping, arrayHelpers, allowChoosingType=false, useTypes=false, isSubmitting, handleChange, title, fixedMappingType}) => {
  const classes = useStyles();

  const [menu, setMenu] = React.useState<{index: number, anchor: null | HTMLElement}>({index: -1, anchor: null});
  const toggleMappingMenu = (index: number, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (index === menu.index) setMenu({index: -1, anchor: null});
    else if (event) setMenu({index: index, anchor: event.currentTarget});
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source</TableCell>
            {fixedMappingType ? null : <TableCell>Relationship</TableCell>}
            <TableCell>Concept</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((value, index) => (
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
            />
          ))}
        </TableBody>
      </Table>
      {typeof errors !== 'string' ? null : (
        <Typography className={classes.errorContainer} color="error" variant="caption" component="div">
          <ErrorMessage name={valuesKey} component="span"/>
        </Typography>
      )}
      <br/>
      <Button variant="outlined" color="primary" size="small" disabled={isSubmitting} onClick={() => arrayHelpers.push(createNewMapping())}>
        Add {title}
      </Button>
  </div>
  );
};


export default MappingsTable;
