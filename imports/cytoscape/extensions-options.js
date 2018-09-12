export const navigator_options  = {
    container: null // can be a HTML or jQuery element or jQuery selector
        , viewLiveFramerate: 0 // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
        , thumbnailEventFramerate: 30 // max thumbnail's updates per second triggered by graph updates
        , thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
        , dblClickDelay: 200 // milliseconds
        , removeCustomContainer: true // destroy the container specified by user on plugin destroy
        , rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
};

export const undo_redo_options =  {
    isDebug: false, // Debug mode for console messages
    actions: {},// actions to be added
    undoableDrag: true, // Whether dragging nodes are undoable can be a function as well
    stackSizeLimit: undefined, // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
    ready: function () { // callback when undo-redo is ready

    }
};

export const panzoom_options = {
    zoomFactor: 0.05, // zoom factor per zoom tick
    zoomDelay: 45, // how many ms between zoom ticks
    minZoom: 0.1, // min zoom level
    maxZoom: 10, // max zoom level
    fitPadding: 50, // padding when fitting
    panSpeed: 10, // how many ms in between pan ticks
    panDistance: 10, // max pan distance per tick
    panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
    panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
    panInactiveArea: 8, // radius of inactive area in pan drag box
    panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
    zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
    fitSelector: undefined, // selector of elements to fit
    animateOnFit: function () { // whether to animate on fit
        return false;
    },
    fitAnimationDuration: 1000, // duration of animation on fit

    // icon class names
    sliderHandleIcon: 'fa fa-minus',
    zoomInIcon: 'fa fa-plus',
    zoomOutIcon: 'fa fa-minus',
    resetIcon: 'fa fa-expand'
};
