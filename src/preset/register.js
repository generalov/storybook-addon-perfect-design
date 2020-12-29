import React from 'react';
import {addons, types} from '@storybook/addons';
import {Button} from "../Button";
import {Panel} from '../Panel'
import {ADDON_ID, ADDON_TITLE, PANEL_ID, PARAM_KEY} from "../constants";


const PreviewWrapper = ({children}) => (
    <div
        style={{
            width: '100%',
            height: '100%',
        }}
    >
        {children}
        <Panel/>
    </div>
);

addons.register(ADDON_ID, () => {
    // addons.add(PANEL_ID, {
    //     title: ADDON_TITLE,
    //     type: types.PANEL,
    //     paramKey: PARAM_KEY,
    //     render: ({active, key}) => (
    //         React.createElement(Panel, {active, key})
    //     )
    // });

    addons.add(`${ADDON_ID}/preview`, {
        title: ADDON_TITLE,
        type: types.PREVIEW,
        render: PreviewWrapper,
    });

    addons.add(ADDON_ID, {
        title: ADDON_TITLE,
        type: types.TOOL,
        match: ({viewMode}) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
        render: () => <Button/>,
    });
});

