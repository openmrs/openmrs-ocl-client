import {AxiosResponse} from "axios";
import {AnyAction} from "redux";

export interface Action extends AnyAction{
    type: string,
    payload?: {},
    meta: any[],
}

const START = 'START';
const FAILURE = 'FAILURE';
const COMPLETE = 'COMPLETE';

const createActionType = (type: string): Function => (): {[key: string]: string} => ({type});

const createActionThunk = (action: string, task: (...args: any[]) => Promise<AxiosResponse<any>>) => {
    /*
    ** Create an redux thunk that dispatches start, runs task, dispatched success/failure and completed actions
     */
    return (...args: any) => {
        return async (dispatch: Function) => {
            try {
                dispatch({
                    type: `${action}_${START}`,
                    meta: args,
                });

                try {
                    const response = await task(...args);
                    dispatch({
                        type: action,
                        payload: response.data,
                        meta: args,
                    });
                } catch (error) {
                    dispatch({
                        type: `${action}_${FAILURE}`,
                        payload: error.response.data,
                        meta: args
                    });
                }
            } catch (error) {
                console.log("should not happen", error);

                dispatch({
                    type: `${action}_${FAILURE}`,
                    payload: "The action could not be completed (1)",
                    meta: args
                });
            } finally {
                dispatch({
                    type: `${action}_${COMPLETE}`,
                    meta: args
                })
            }
        }
    }
};

export {createActionType, createActionThunk};
