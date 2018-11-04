export const selectedNode = (state = null, action) => {
    switch (action.type) {
        case 'SELECTED':
            return action.id;
        default:
            return state;
    }
};

export const ontologyInfo = (state = null, action) => {
    switch (action.type) {
        case 'namespace':
            return {
                namespace: action.namespace
            };
        default:
            return state;
    }
};

//controls before draw canvas

export const drawControl = (state = { apply_kce : false}, action) => {
    switch (action.type) {
        case 'setKce':
            state.apply_kce = !state.apply_kce;
            return ({...state});
        default:
            return state;
    }
};

export const userLoggedIn = function (state = false, action) {
    switch (action.type) {
        case 'Login':
            return action.boole;
        default:
            return state;
    }
};

export const canvasAnimations = (state = false, action) => {
    switch (action.type) {
        case 'ShowNeighborhood':
            return {
                animation: action.type,
            };


        case 'ShowRestriction':
            return {
                animation: action.type,
            };

        case 'ShowClassHierarchy':
            return {
                animation: action.type,
            };


        case 'ResetCanvas':
            return {
                animation: action.type,
            };

        case 'ShowPitfalls':
            return {
                animation: action.type,
                affected_elements: action.affected_elements
            };

        case 'Undo':
            return {
                animation: action.type,
            };


        case 'Redo':
            return {
                animation: action.type,
            };


        case 'Pop-up':
            return {
                animation: action.type,
            };

        case 'Hide':
            return {
                animation: action.type,
            };

        case 'Filter':
            return {
                animation: action.type,
                filter_type: action.filter_type,
                checked: action.checked
            };

        case 'Reset':
            return {
                animation: "Reset"
            };


        default:
            return state;
    }
};

let initial_ui_state = {
    sidebar: false,
    navigator: true
};


export const canvasProperties = (state = initial_ui_state, action) => {
    switch (action.type) {
        case 'showNavigator':
            state.navigator = !state.navigator;
            return ({...state});
        case 'showSidebar':
            state.sidebar = !state.sidebar;
            return ({...state});
        default:
            return state;
    }
};


export const History = (state = [], action) => {
    switch (action.type) {
        case 'addHistory':
            state.push(action.event);
            console.log(state);
            return state;
        default:
            return state;
    }
};


export const SearchReducer = (state = [], action) => {
    switch (action.type) {
        case 'Search':
            return {
                type: action.type,
                text: action.text,
                result: []
            };

        case 'SearchResult':
            return {
                type: action.type,
                result: action.search_result,
            };
        default:
            return {result: []};
    }
};

