import {useAddonState, useGlobals, useParameter} from '@storybook/api';
import {IconButton as IconButton1, Icons} from "@storybook/components";
import {styled} from "@storybook/theming";
import React, {Fragment, useCallback} from "react";
import {Rnd} from "react-rnd";
import {ADDON_ID, PARAM_KEY} from "./constants";

const getUrl = input => {
    return typeof input === 'string' ? input : input.url;
};

const IconButton = styled(IconButton1)`
    height: auto;
`;

const Label = styled('label')`
    display: inline-flex;
    align-items: center; 
    input {
        margin-left: .25em;
    }
`;

const Iframe = styled.iframe({
    width: '100%',
    height: '100%',
    border: '0 none',
});

const Img = styled.img({
    border: '0 none',
    objectFit: 'contain',
});

const Toolbar = styled.div({
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    gap: "0 .5em",
    backgroundColor: 'white',
    padding: ".25em .25em .25em .5em",
    alignItems: 'center',
    fontSize: "75%"
});

const Border = styled.div({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none'
});

const Asset = ({url, style}) => {
    if (!url) {
        return null;
    }
    if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
        return <Img alt="" src={url} style={style}/>;
    }

    return <Iframe title={url} src={url} style={style}/>;
};

const Content = () => {
    const results = useParameter(PARAM_KEY, []);
    // const [selected, setSelected] = useAddonState('my/addon-perfect-design', 0); // addon state being persisted here
    // const {storyId} = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

    if (results.length === 0) {
        return null;
    }

    // if (results.length && !results[selected]) {
    //     setSelected(0);
    //     return null;
    // }

    // const url = getUrl(results[selected]).replace('{id}', storyId);
    const selected = 0;
    const url = getUrl(results[selected]);

    return (
        <Asset url={url}/>
    );
};

const Dnd = ({x, y, width, height, opacity, lock, invert, onResize, children}) => {
    const style = {
        // position: 'fixed',
        // zIndex: 9999,
        opacity,
        ...(lock
            ? {pointerEvents: 'none', backgroundColor: 'transparent'}
            : {backgroundColor: 'magenta'}),
        ...(invert && {
            // filter: 'invert(1)',
            mixBlendMode: "difference"
        }),
    }

    const onKeyDown = useCallback((evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        const ops = {
            "ArrowLeft": [-1, 0],
            "ArrowRight": [1, 0],
            "ArrowUp": [0, -1],
            "ArrowDown": [0, 1],
        }
        const shift = (evt.shiftKey && evt.altKey) ? 0.1 : evt.shiftKey ? 10 : 1;
        if (ops[evt.key]) {
            const [deltaX, deltaY] = ops[evt.key]
            onResize(({x, y}) => {
                return {
                    x: (parseFloat(x) + deltaX * shift).toFixed(2),
                    y: (parseFloat(y) + deltaY * shift).toFixed(2)
                }
            })
        }
    }, [onResize]);

    return <Rnd
        style={style}
        size={{width, height}}
        position={{x, y}}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onDragStop={(e, d) => {
            onResize(({
                x: d.x,
                y: d.y,
            }))
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
            onResize({
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
                x: position.x,
                y: position.y
            })
        }}
    >
        <Border>{children}</Border>
    </Rnd>
}

export const Panel = () => {
    const [globals] = useGlobals();
    const isActive = globals[PARAM_KEY] || false;
    const [state, setState] = useAddonState(ADDON_ID, {
        lock: false,
        invert: false,
        opacity: 0.5,
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        rnd: 0
    });
    const onChange = useCallback((e) => {
        const target = e.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setState(({...state, [name]: value}))
    }, [setState]);

    const onResize = useCallback((newState) => {
        const shouldRedraw = 'width' in newState || 'height' in newState
        if (typeof newState === 'function') {
            setState(s => ({
                ...s,
                ...newState(s),
                ...(shouldRedraw && {rnd: s.rnd + 1})
            }))
        } else {
            setState({
                ...state,
                ...newState,
                ...(shouldRedraw && {rnd: state.rnd + 1})
            })
        }
    }, [state])
    if (!isActive) {
        return null
    }

    const toggle = (e) => {
        const {name} = e.currentTarget;
        setState({...state, [name]: !state[name]})
    }


    return (
        <Fragment>
            <Toolbar>
                <IconButton
                    name="lock"
                    active={state.lock}
                    title="Lock preview"
                    onClick={toggle}
                >
                    <Icons icon="lock"/>
                </IconButton>
                <IconButton
                    name="invert"
                    active={state.invert}
                    title="Invert preview"
                    onClick={toggle}
                >
                    <Icons icon="mirror"/>
                </IconButton>
                <Label>Opacity <input name="opacity" type="range" min="0" max="1" step="0.01"
                                      value={state.opacity}
                                      onChange={onChange}/></Label>
                <Label>x <input name="x" type="number" step="0.1"
                                style={{width: '5em'}}
                                value={state.x}
                                onChange={onChange}/></Label>
                <Label>y <input name="y" type="number" step="0.1"
                                style={{width: '5em'}}
                                value={state.y}
                                onChange={onChange}/></Label>
                <Label>w <input name="width" type="number" step="0.1"
                                style={{width: '5em'}}
                                value={state.width}
                                onChange={onChange}/></Label>
                <Label>h <input name="height" type="number" step="0.1"
                                style={{width: '5em'}}
                                value={state.height}
                                onChange={onChange}/></Label>
            </Toolbar>
            <Dnd x={state.x} y={state.y} width={state.width} height={state.height}
                 opacity={state.opacity}
                 lock={state.lock}
                 invert={state.invert}
                 onResize={onResize}>
                <Content key={state.rnd}/>
            </Dnd>
        </Fragment>)
}
