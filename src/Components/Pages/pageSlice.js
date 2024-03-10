import { createSlice } from '@reduxjs/toolkit';
import React from 'react';

//(React Redux)
//The "Window" component manages the current page state
//updates it and returns the updated value for use
export const pageSlice = createSlice({
    name: 'update_page',
    initialState: {
        value: true,
    },

    reducers: {
        set_update_page: (state, action) =>
        { 
            return {
                ...state,
                value: action.payload
            }
        }
               
    },

})

export const {set_update_page} = pageSlice.actions;

export default pageSlice.reducer