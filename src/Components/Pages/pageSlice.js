import { createSlice } from '@reduxjs/toolkit';

//(React Redux)
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