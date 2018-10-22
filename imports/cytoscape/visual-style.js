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
            'text-valign': 'center',
            'border-style' : 'double',
            'border-color' : 'black',
            'border-width' : '6',
            'width' : '160%',
            'height' : '160%'
        }
    },


    {
        selector: 'node[group="restriction"]',
        style: {
            'shape' : 'ellipse',
            'background-color' : '#a7a7a7',
            'text-valign': 'center',
            'border-style' : 'double',
            'border-color' : 'black',
            'border-width' : '6',
            'width' : '50%',
            'height' : '50%'
        }
    },


    {
        selector: 'node[group="intersectionOf"]',
        style: {
            'shape' : 'rectangle',
            'background-color' : '#707070',
            'font-size' : '50%',
            'font-weight' : 'bolder',
            'text-valign': 'center',
            'border-color' : 'black',
            'border-width' : '3',
            'width' : '40%',
            'height' : '50%'
        }
    },

    {
        selector: 'node[group="unionOf"]',
        style: {
            'shape' : 'rectangle',
            'background-color' : '#707070',
            'font-size' : '50%',
            'text-valign': 'center',
            'border-color' : 'black',
            'border-width' : '3',
            'width' : '40%',
            'height' : '50%'
        }
    },

    {
        selector: 'node[group="allValuesFrom"]',
        style: {
            'shape' : 'rectangle',
            'background-color' : '#E0F700',
            'font-size' : '50%',
            'text-valign': 'center',
            'border-color' : 'black',
            'border-width' : '3',
            'width' : '40%',
            'height' : '50%'
        }
    },
    {
        selector: 'node[group="someValuesFrom"]',
        style: {
            'shape' : 'rectangle',
            'background-color' : '#E0F700',
            'font-size' : '50%',
            'text-valign': 'center',
            'border-color' : 'black',
            'border-width' : '3',
            'width' : '40%',
            'height' : '50%'
        }
    },
    {
        selector: 'node[group="hasValue"]',
        style: {
            'shape' : 'ellipse',
            'background-color' : '#ffffff',
            'text-valign': 'center',
            'border-style' : 'double',
            'border-color' : 'black',
            'border-width' : '6',
            'width' : '90%',
            'height' : '90%'
        }
    },
    {
        selector: 'node[group="oneOf"]',
        style: {
            'shape' : 'rectangle',
            'background-color' : '#707070',
            'text-valign': 'center',
            'border-color' : 'black',
            'border-width' : '3',
            'width' : '130%',
            'height' : '50%'
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
        selector: 'node[group="thing"]',
        style: {
            'shape' : 'ellipse',
            'background-color' : '#ffffff',
            'text-valign': 'center',
            'border-style' : 'double',
            'border-color' : 'black',
            'border-width' : '6',
            'width' : '90%',
            'height' : '90%'
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
        selector: 'edge[group="subclass"]',
        style: {
            'label': 'Subclass of',
            'line-style' : 'dashed',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'black',
        }
    },

    {
        selector: 'edge[group="list"]',
        style: {
            'label': 'List item',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'black',
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
            'border-width' : '10px',
            'border-style' : 'solid',
            'border-color' : 'red'
        }
    }


];