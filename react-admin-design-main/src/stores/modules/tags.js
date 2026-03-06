import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    visitedTags: [],
    cachedTags: new Set()
};
const createAppAsyncThunk = createAsyncThunk.withTypes();
const tags = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        addVisitedTags: (state, action) => {
            const hasExistIndex = state.visitedTags.findIndex(tag => tag.path === action.payload.path);
            if (hasExistIndex < 0) {
                state.visitedTags.push(action.payload);
            }
            else {
                state.visitedTags[hasExistIndex] = Object.assign({}, state.visitedTags[hasExistIndex], action.payload);
            }
        },
        updateVisitedTags: (state, action) => {
            state.visitedTags = action.payload;
        },
        closeTagsByType: (state, action) => {
            let restTags = [];
            const { type, path } = action.payload;
            const { visitedTags } = state;
            const tagIndex = visitedTags.findIndex((tag) => tag.fullPath === path);
            const affixTags = visitedTags.filter((tag) => tag?.meta?.affix);
            switch (type) {
                case 'left':
                    restTags = visitedTags.slice(tagIndex);
                    break;
                case 'right':
                    restTags = visitedTags.slice(0, tagIndex + 1);
                    break;
                case 'other':
                    restTags = visitedTags.filter((tag) => tag.fullPath === path);
                    break;
            }
            state.visitedTags = affixTags.concat(restTags.filter((tag) => !tag.meta?.affix));
        },
        updateCacheTags: state => {
            const cachedSet = new Set();
            state.visitedTags.forEach((tag) => {
                if (tag.meta?.keepAlive) {
                    cachedSet.add(tag.name);
                }
            });
            state.cachedTags = cachedSet;
        },
        clearCacheTags: state => {
            state.cachedTags = new Set();
        }
    }
});
export const closeTagByKey = createAppAsyncThunk('tags/closeTagByKey', (path, { getState, dispatch }) => {
    const { visitedTags } = getState().tags;
    const tagIndex = visitedTags.findIndex((tag) => tag.fullPath === path);
    const restTags = visitedTags.filter((tag) => tag.fullPath !== path);
    dispatch(updateVisitedTags(restTags));
    return Promise.resolve({
        tagIndex,
        tagsList: restTags
    });
});
export const closeAllTags = createAppAsyncThunk('tags/closeAllTags', (_, { getState, dispatch }) => {
    const { visitedTags } = getState().tags;
    const restTags = visitedTags.filter((tag) => tag?.meta?.affix);
    dispatch(updateVisitedTags(restTags));
    return Promise.resolve(restTags);
});
export const { addVisitedTags, updateVisitedTags, closeTagsByType } = tags.actions;
export default tags.reducer;
