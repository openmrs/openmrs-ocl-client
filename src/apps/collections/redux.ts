import {createActionThunk} from "../../redux";
import api from "./api";
import {errorSelector} from "../../redux/redux";

const CREATE_COLLECTION_ACTION = 'collections/create';

const createCollectionAction = createActionThunk(CREATE_COLLECTION_ACTION, api.create);

const createCollectionErrorSelector = errorSelector(CREATE_COLLECTION_ACTION);

export {createCollectionAction, createCollectionErrorSelector};
