import {AxiosResponse} from "axios";
import {AnyAction} from "redux";

export interface Action extends AnyAction{
    type: string,
    payload?: {},
    meta: any[],
}

const START = 'START';
const FAILURE = 'FAILURE';
const PROGRESS = 'PROGRESS';
const COMPLETE = 'COMPLETE';

const createActionType = (type: string): Function => (): {[key: string]: string} => ({type});

const startAction = (action: string, ...args: any[]) => ({
    type: `${action}_${START}`,
    meta: args,
});

const progressAction = (action: string, payload: string) => ({
    type: `${action}_${PROGRESS}`,
    payload,
});

const completeAction = (action: string, ...args: any[]) => ({
    type: `${action}_${COMPLETE}`,
    meta: args,
});

const createActionThunk = <T extends any[]>(action: string, task: (...args: T) => Promise<AxiosResponse<any>>) => {
    /*
    ** Create an redux thunk that dispatches start, runs task, dispatched success/failure and completed actions
     */
    return <S>(...args: T) => {
        return async (dispatch: Function): Promise<boolean | S> => {
            let result = true;

            try {
                dispatch(startAction(action, ...args));

                try {
                    const response = await task(...args);
                    dispatch({
                        type: action,
                        payload: response.data,
                        meta: args,
                    });

                    result = response.data;
                } catch (error) {
                    dispatch({
                        type: `${action}_${FAILURE}`,
                        payload: error.response.data,
                        meta: args
                    });
                    result = false;
                }
            } catch (error) {
                console.log("should not happen", error);

                dispatch({
                    type: `${action}_${FAILURE}`,
                    payload: "The action could not be completed (1)",
                    meta: args
                });

                result = false;
            } finally {
                dispatch(completeAction(action, ...args));
            }
            return result;
        }
    }
};

export {createActionType, createActionThunk, startAction, progressAction, completeAction};
