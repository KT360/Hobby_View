import { createSlice } from '@reduxjs/toolkit';

//(React Redux)
//The "Window" component manages the current page state
//updates it and returns the updated value for use
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