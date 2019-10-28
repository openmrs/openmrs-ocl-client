import {createActionThunk} from "../../redux";
import api from "./api";
import {errorSelector} from "../../redux/redux";

const CREATE_SOURCE_ACTION = 'sources/create';

const createSourceAction = createActionThunk(CREATE_SOURCE_ACTION, api.create);

const createSourceErrorSelector = errorSelector(CREATE_SOURCE_ACTION);

export {createSourceAction, createSourceErrorSelector};
