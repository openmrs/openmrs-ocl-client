import React from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TablePagination
} from "@mui/material";
import { NotificationItemRow, NotificationItem } from "../types";
import { EnhancedNotificationSummaryTableHead } from "./EnhancedNotificationSummaryTableHead";
import { getComparator, stableSort } from "../../../utils";
import { CSVLink } from "react-csv";
import { makeStyles } from "@mui/styles";

interface Props {
  open: boolean;
  handleClose: () => void;
  notification: NotificationItem;
  importDateTime: string;
}

const useStyles = makeStyles({
  dialogTitle: {
    textAlign: "center"
  },
  tableContainer: {
    display: "contents"
  },
  tablePagination: {
    bottom: "0",
    position: "sticky",
    backgroundColor: "#fafafa"
  },
  noPadding: {
    padding: "0px"
  },
  csvLink: {
    width: "100%",
    borderRight: "1px solid #809fe0"
  },
  exportToCSV: {
    display: "inline-block"
  }
});

const NotificationDetails: React.FC<Props> = ({
  open,
  handleClose,
  notification,
  importDateTime
}) => {
  const classes = useStyles();

  const dictionaryName = notification.meta
    ? notification.meta[0].split("/")[4]
    : "";
  const sourceName =
    notification.result.length > 0
      ? notification.result[0].expression.split("/")[4]
      : "";

  const getParentConceptIds = () => {
    const meta = notification.meta;
    if (meta && meta.length > 1) {
      const requestPayload = meta[1];
      const conceptIds = requestPayload.map(
        (concept: { id: string }) => concept.id
      );
      return conceptIds;
    } else {
      return [];
    }
  };
  const parentConceptIds = getParentConceptIds();

  const getConceptId = (row: NotificationItemRow) => {
    return row.expression.split("/")[6];
  };

  const getConceptType = (row: NotificationItemRow) => {
    const getActualIndex = (ele: string) => ele === getConceptId(row);
    const actualIndex = parentConceptIds.findIndex(getActualIndex);
    return actualIndex > -1 ? "Parent" : "Dependent";
  };

  const getStatus = (row: NotificationItemRow) => {
    return row.added ? "Imported" : "Skipped";
  };

  const getReason = (row: NotificationItemRow) => {
    return typeof row.message === "string"
      ? row.message
      : row.message.join(" ");
  };

  const getDialogTitle = () => {
    return (
      <Typography variant="h5">
        {dictionaryName} - Adding concepts from {sourceName}
      </Typography>
    );
  };

  const createData = (
    conceptId: string,
    conceptType: string,
    status: string,
    reasons: string
  ) => {
    return { conceptId, conceptType, status, reasons };
  };

  const getSummaryRowsToDisplay = () => {
    const conceptRows = notification.result.filter(row =>
      row.expression.includes("/concepts/")
    );
    return conceptRows.map(row => {
      return createData(
        getConceptId(row),
        getConceptType(row),
        getStatus(row),
        getReason(row)
      );
    });
  };
  const summaryRowsToDisplay = getSummaryRowsToDisplay();

  type Order = "asc" | "desc";

  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState("status");
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const resetSortingAndPagination = () => {
    setOrder("desc");
    setOrderBy("status");
    setPage(0);
    setRowsPerPage(10);
  };

  const resetAndClose = () => {
    resetSortingAndPagination();
    handleClose();
  };

  const getTableContent = () => {
    return (
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader>
          <EnhancedNotificationSummaryTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(summaryRowsToDisplay, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.conceptId} data-testid={row.conceptId}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.conceptId}</TableCell>
                  <TableCell>{row.conceptType}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.reasons}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getTablePagination = () => {
    return (
      <TablePagination
        className={classes.tablePagination}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={summaryRowsToDisplay.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    );
  };

  const csvHeaders = [
    { label: "Concept ID", key: "conceptId" },
    { label: "Concept Type", key: "conceptType" },
    { label: "Status", key: "status" },
    { label: "Reasons", key: "reasons" }
  ];

  return (
    <>
      <Dialog
        data-testid="notification-details-dialog"
        onClose={resetAndClose}
        open={open}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle data-testid="title" className={classes.dialogTitle}>
          {getDialogTitle()}
        </DialogTitle>
        <DialogContent dividers className={classes.noPadding}>
          {getTableContent()}
          {getTablePagination()}
        </DialogContent>
        <DialogActions disableSpacing>
          <CSVLink
            className={classes.csvLink}
            headers={csvHeaders}
            data={summaryRowsToDisplay}
            filename={`${dictionaryName}_${importDateTime}.csv`}
            enclosingCharacter={``}
          >
            <Button className={classes.exportToCSV} fullWidth color="primary">
              Export to CSV
            </Button>
          </CSVLink>
          <ButtonGroup fullWidth color="primary" variant="text" size="medium">
            <Button onClick={resetAndClose} color="secondary">
              Close
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationDetails;
