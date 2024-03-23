import { createSlice } from '@reduxjs/toolkit';

//(React Redux)
export const cardSlice = createSlice({
    name: 'selected',
    initialState: {
        value: "",
    },

    reducers: {
        set_selected: (state, action) =>
        { 
            return {
                ...state,
                value: action.payload
            }
        }
               
    },

})

export const {set_selected} = cardSlice.actions;

export default cardSlice.reducer