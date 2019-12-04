import React from 'react'
import { Button, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonWrapper: {
      textAlign: 'center',
      marginTop: '2vh',
    },
  }),
)

const AddBulkConceptsPage = () => {
  const classes = useStyles()

  return (
    <Grid
      item
      xs={6}
    >
      <TextField fullWidth rows={10} multiline variant="outlined"/>
      <br/>
      <div className={classes.buttonWrapper}>
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          // disabled={isSubmitting}
        >
          Add concepts
        </Button>
      </div>
    </Grid>
  )
}

export default AddBulkConceptsPage
