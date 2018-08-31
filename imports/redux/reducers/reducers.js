export const selectedNode = (state = null, action) => {
    switch (action.type) {
        case 'SELECTED':
            return action.id;
        default:
            return state;
    }
};

export const draw = (state = false, action) => {
    switch (action.type) {
        case 'CANVAS':
            return action.boole;
        default:
            return state;
    }
};

export const userLoggedIn = function(state = false , action) {
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
                animation : action.boole,
                type : action.animation
            };


        case 'ShowRestriction':
            return {
                animation : action.boole,
                type : action.animation
            };

        case 'ResetCanvas':
            return{
                animation: action.boole,
                type: action.animation
            };

        case 'ShowPitfall':
            return{
                animation: action.boole,
                type:action.animation,
                affected_elements: action.affected_elements
            };

        case 'Search':
            return{
                animation: action.boole,
                type: action.animation,
            };

        case 'Undo':
            return{
                animation: action.boole,
                type: action.animation,
            };

        case 'Redo':
            return{
                animation: action.boole,
                type: action.animation,
            };

        default:
            return state;
    }
};

let initial_ui_state = {
    sidebar : false,
    navigator : true
};


export const canvasProperties = (state = initial_ui_state, action) => {
    switch (action.type) {
        case 'showNavigator':
            state.navigator = !state.navigator;
            return ( {...state }  );
        case 'showSidebar':
            state.sidebar = !state.sidebar;
            console.log("sidebar");
            return ( {...state }  );
        default:
            return state;
    }
};


export const History = (state = [] , action) => {
    switch (action.type) {
        case 'addHistory':
            state.push(action.event);
            console.log(state);
            return state;
        default:
            return state;
    }
};