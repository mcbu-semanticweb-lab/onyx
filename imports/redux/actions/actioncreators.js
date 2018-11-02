//User login control
export const isLoggedIn = function (boole) {
    return {
        type: "Login",
        boole: boole
    }
};


//KCE control

export const setKce = function (boolean) {
    return {
        type: "setKce",
        kce: boolean
    }
};

//Ontology Info

export const select = function (id) {
    return {
        type: "SELECTED",
        id: id
    }
};


//Node select

export const setNamespace = function (ns) {
    return {
        type: "namespace",
        namespace: ns
    }
};


//Canvas animations TODO : tek aksiyon oluşturucu ile minimize?

export const showNeighborhood = function () {
    return {
        type: "ShowNeighborhood"
    }
};
export const showClassHierarchy = function () {
    return {
        type: "ShowClassHierarchy"
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

export const showRestriction = function () {
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


export const filter = function (filter_type,checked) {
    return {
        type: "Filter",
        filter_type : filter_type,
        checked: checked
    }
};

export const reset = function (type) {
    return {
        type: "Reset",
    }
};


//UI animations

export const showNavigator = function () {
    return {
        type: "showNavigator"
    }
};

export const showSidebar = function () {
    return {
        type: "showSidebar"
    }
};

// Canvas history

export const addHistory = function (event) {
    return {
        type: "addHistory",
        event: event
    }
};




