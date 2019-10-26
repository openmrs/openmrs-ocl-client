import {createActionThunk} from "../../redux";
import api from "./api";

const CREATE_COLLECTION_ACTION = 'collections/create';

const createCollectionAction = createActionThunk(CREATE_COLLECTION_ACTION, api.create);

export {createCollectionAction};
