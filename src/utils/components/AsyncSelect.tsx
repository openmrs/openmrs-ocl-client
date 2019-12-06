import React, { CSSProperties, HTMLAttributes } from "react";
import {
  createStyles,
  emphasize,
  makeStyles,
  useTheme,
  Theme
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField, { BaseTextFieldProps } from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { ValueContainerProps } from "react-select/src/components/containers";
import { ControlProps } from "react-select/src/components/Control";
import { MenuProps, NoticeProps } from "react-select/src/components/Menu";
import { OptionProps } from "react-select/src/components/Option";
import { PlaceholderProps } from "react-select/src/components/Placeholder";
import { SingleValueProps } from "react-select/src/components/SingleValue";
import { Omit } from "@material-ui/types";
import {
  components as ReactSelectComponents,
  IndicatorProps
} from "react-select";
import AsyncPaginate from "react-select-async-paginate";
import { Option } from "../types";
import {
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon
} from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import { LoadingIconProps } from "react-select/src/components/indicators";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      display: "flex",
      paddingTop: theme.spacing(0.5)
    },
    icon: {
      padding: 0
    },
    valueContainer: {
      display: "flex",
      flexWrap: "wrap",
      flex: 1,
      alignItems: "center",
      overflow: "hidden"
    },
    message: {
      padding: theme.spacing(1, 2)
    },
    singleValue: {
      fontSize: 16
    },
    placeholder: {
      position: "absolute",
      left: 2,
      bottom: 6,
      fontSize: 16
    },
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
    },
    divider: {
      height: theme.spacing(2)
    }
  })
);

const LoadingMessage = (props: NoticeProps<Option>) => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.message}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

function NoOptionsMessage(props: NoticeProps<Option>) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.message}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> &
  HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<Option>) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps }
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
    />
  );
}

function OptionComponent(props: OptionProps<Option>) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

type MuiPlaceholderProps = Omit<PlaceholderProps<Option>, "innerProps"> &
  Partial<Pick<PlaceholderProps<Option>, "innerProps">>;

function Placeholder(props: MuiPlaceholderProps) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

function SingleValue(props: SingleValueProps<Option>) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props: ValueContainerProps<Option>) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

const DropdownIndicator = (props: any) => {
  return (
    <ReactSelectComponents.DropdownIndicator
      className={props.selectProps.classes.icon}
      {...props}
    >
      <ArrowDropDownIcon color="action" />
    </ReactSelectComponents.DropdownIndicator>
  );
};

const IndicatorSeparator = () => {
  return null;
};

const LoadingIndicator = (props: LoadingIconProps<Option>) => {
  return (
    <CircularProgress
      className={props.selectProps.classes.icon}
      {...props.innerProps}
      size={20}
    />
  );
};

const ClearIndicator = (props: IndicatorProps<Option>) => {
  return (
    <ReactSelectComponents.ClearIndicator
      className={props.selectProps.classes.icon}
      {...props}
    >
      <CloseIcon color="action" />
    </ReactSelectComponents.ClearIndicator>
  );
};

function Menu(props: MenuProps<Option>) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  LoadingMessage,
  NoOptionsMessage,
  Option: OptionComponent,
  Placeholder,
  SingleValue,
  ValueContainer,
  DropdownIndicator,
  IndicatorSeparator,
  LoadingIndicator,
  ClearIndicator
};

interface Props {
  placeholder: string;
  value: any;
  onChange: Function;
  loadOptions: Function;
  additional: {};
  isDisabled: boolean;
  onBlur: Function;
}

const AsyncSelect: React.FC<Props> = props => {
  const classes = useStyles();
  const theme = useTheme();

  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };

  return (
    // @ts-ignore
    <AsyncPaginate
      isClearable={true}
      classes={classes}
      styles={selectStyles}
      components={components}
      {...props}
    />
  );
};

export default AsyncSelect;
