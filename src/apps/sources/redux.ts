import {createActionThunk} from "../../redux";
import api from "./api";

const CREATE_SOURCE_ACTION = 'sources/create';

const createSourceAction = createActionThunk(CREATE_SOURCE_ACTION, api.create);

export {createSourceAction};
