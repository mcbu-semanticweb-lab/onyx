//User login control
export const isLoggedIn = function (boole) {
    return {
        type: "Login",
        boole: boole
    }
};


//Node select

export const select = function (id) {
    return {
        type: "SELECTED",
        id: id
    }
};

//Should canvas draw

export const draw = function (boole) {
    return {
        type: "CANVAS",
    }
};


//Canvas animations

export const showNeighborhood = function (boole) {
    return {
        type: "ShowNeighborhood"
    }
};

export const resetCanvas = function () {
    return {
        type: "ResetCanvas",
        boole: false,
    } //canvas reducer la birleşecek
};

export const pitfall = function (affected_elements) {
    return {
        type: "ShowPitfalls",
        affected_elements: affected_elements,
    }
};

export const searchAC = function (text) {
        return {
            type: "Search",
            text : text
        }
};

export const searchRes = function (res) {
    return {
        type: "SearchResult",
        search_result : res
    }
};

export const showrestriction = function () {
    return {
        type: "ShowRestriction",
    }
};

export const undo = function () {
    return {
        type: "Undo",
    }
};

export const redo = function () {
    return {
        type: "Redo",
    }
};

export const popup = function () {
    return {
        type: "Pop-up",
    }
};

export const hide = function () {
    return {
        type: "Hide",
    }
};


export const filter = function (type) {
    return {
        type: "Filter",
        filter : type
    }
};

export const reset = function (type) {
    return {
        type: "Reset",
    }
};


//UI animations

export const shownavigator = function () {
    return {
        type: "showNavigator"
    }
};

export const showsidebar = function () {
    return {
        type: "showSidebar"
    }
};

// Canvas history

export const addhistory = function (event) {
    return {
        type: "addHistory",
        event: event
    }
};




