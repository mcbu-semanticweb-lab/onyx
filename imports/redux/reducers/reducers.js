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

export const canvasAnimations = (state = {}, action) => {
    switch (action.type) {
        case 'ShowNeighborhood':
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
        default:
            return state;
    }
};

