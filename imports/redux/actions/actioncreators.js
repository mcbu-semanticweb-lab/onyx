export const select = function(id) {
    return {
        type : "SELECTED",
        id : id
    }
};

export const draw = function (boole) {
    return{
        type: "CANVAS",
        boole : boole
    }
};

export const showNeighborhood = function (boole) {
    return{
        type: "ShowNeighborhood",
        boole : boole,
        animation: "Show Neighborhood"
    }
};

export const resetCanvas = function () {
    return{
        type: "ResetCanvas",
        boole : false,
        animation: "Reset Canvas"
    }
};
