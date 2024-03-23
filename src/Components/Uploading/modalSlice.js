import { createSlice } from '@reduxjs/toolkit';


//(React Redux)
export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        value: { notes:""},
    },

    reducers: {
        update_form: (state, action) =>
        { 

            const newState =  {
                ...state,
                value:{
                    ...state.value,
                    ...action.payload
                } ,
            };

            console.log("New state: "+ JSON.stringify(newState));
            return newState;
        }
               
    },

})

export const {update_form} = modalSlice.actions;

export default modalSlice.reducer