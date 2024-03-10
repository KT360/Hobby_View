import { createSlice } from '@reduxjs/toolkit';

//(React Redux)
//The "Window" component manages the current page state
//updates it and returns the updated value for use
export const modeSlice = createSlice({
    name: 'loading',
    initialState: {
        value: false,
    },

    reducers: {
        set_loading: (state, action) =>
        { 
            return {
                ...state,
                value: action.payload
            }
        }
               
    },

})

export const {set_loading} = modeSlice.actions;

export default modeSlice.reducer