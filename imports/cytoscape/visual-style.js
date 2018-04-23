export const DEF_VISUAL_STYLE = [
    {
        selector: 'node',
        style: {
            'label' : 'data(label)',
            'text-valign': 'center',
            'background-color': '#999',
        }
    },

    {
        selector: 'node[group="class"]',
        style: {
            'shape' : 'ellipse',
            'background-color' : '#acf',
            'text-valign': 'center',
            'border-style' : 'double',
            'border-color' : 'black',
            'border-width' : '6',
            'width' : '160',
            'height' : '160'
        }
    },

    {
        selector: 'node[group="object_property"]',
        style: {
            'shape' : 'rectangle',
            'background-color' : '#acf',
            'color': 'black',
            'width' : '130%',
            'font-size' : '9',
            'padding' : '50%',
        }
    },

    {
        selector: 'node[group="datatype_property"]',
        style: {
            'shape' : 'rectangle',
            'background-color' : '#9c6',
            'color': 'black',
            'width' : '130%',
            'font-size' : '9',
            'padding' : '50%',
        }
    },

    {
        selector: 'edge',
        style: {
            'line-color': '#ccc',
            'curve-style': 'bezier',
        }
    },

    {
        selector: 'edge[group="domain"]',
        style: {

        }
    },

    {
        selector: 'edge[group="range"]',
        style: {
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'red',
        }
    },
    {
        selector: '.hover',
        style: {
            'background-color' : '#ff0000',
        }
    },

    {
        selector: '.select',
        style: {
            'border-style' : 'double',
            'border-color' : '#ff0000',
            'border-width' : '6',
        }
    },

    {
        selector: '.pitfall',
        style: {
            'border-width' : '25px',
            'border-style' : 'solid',
            'border-color' : 'orange'
        }
    }


];