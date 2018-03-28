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
        animation: "ShowNeighborhood"
    }
};

export const resetCanvas = function () {
    return{
        type: "ResetCanvas",
        boole : false,
        animation: "ResetCanvas"
    } //canvas reducer la birleşecek
};

export const pitfall = function (affected_elements) {
    return{
        type: "ShowPitfall",
        boole : true,
        animation : "ShowPitfalls",
        affected_elements : affected_elements,
    }
};
