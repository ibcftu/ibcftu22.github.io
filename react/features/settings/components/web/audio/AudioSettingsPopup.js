// @flow

import React from 'react';

import { areAudioLevelsEnabled } from '../../../../base/config/functions';
import {
    getAudioInputDeviceData,
    getAudioOutputDeviceData,
    setAudioInputDeviceAndUpdateSettings,
    setAudioOutputDevice as setAudioOutputDeviceAction
} from '../../../../base/devices';
import Popover from '../../../../base/popover/components/Popover.web';
import { connect } from '../../../../base/redux';
import { SMALL_MOBILE_WIDTH } from '../../../../base/responsive-ui/constants';
import {
    getCurrentMicDeviceId,
    getCurrentOutputDeviceId
} from '../../../../base/settings';
import { toggleAudioSettings } from '../../../actions';
import { getAudioSettingsVisibility } from '../../../functions';

import AudioSettingsContent, { type Props as AudioSettingsContentProps } from './AudioSettingsContent';


type Props = AudioSettingsContentProps & {

    /**
    * Component's children (the audio button).
    */
    children: React$Node,

    /**
    * Flag controlling the visibility of the popup.
    */
    isOpen: boolean,

    /**
    * Callback executed when the popup closes.
    */
    onClose: Function,

    /**
     * The popup placement enum value.
     */
    popupPlacement: string
}

/**
 * Popup with audio settings.
 *
 * @returns {ReactElement}
 */
function AudioSettingsPopup({
    children,
    currentMicDeviceId,
    currentOutputDeviceId,
    isOpen,
    microphoneDevices,
    setAudioInputDevice,
    setAudioOutputDevice,
    onClose,
    outputDevices,
    popupPlacement,
    measureAudioLevels
}: Props) {
    return (
        <div className = 'audio-preview'>
            <Popover
                content = { <AudioSettingsContent
                    currentMicDeviceId = { currentMicDeviceId }
                    currentOutputDeviceId = { currentOutputDeviceId }
                    measureAudioLevels = { measureAudioLevels }
                    microphoneDevices = { microphoneDevices }
                    outputDevices = { outputDevices }
                    setAudioInputDevice = { setAudioInputDevice }
                    setAudioOutputDevice = { setAudioOutputDevice } /> }
                onPopoverClose = { onClose }
                position = { popupPlacement }
                trigger = 'click'
                visible = { isOpen }>
                {children}
            </Popover>
        </div>
    );
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const { clientWidth } = state['features/base/responsive-ui'];

    return {
        popupPlacement: clientWidth <= SMALL_MOBILE_WIDTH ? 'auto' : 'top-end',
        currentMicDeviceId: getCurrentMicDeviceId(state),
        currentOutputDeviceId: getCurrentOutputDeviceId(state),
        isOpen: getAudioSettingsVisibility(state),
        microphoneDevices: getAudioInputDeviceData(state),
        outputDevices: getAudioOutputDeviceData(state),
        measureAudioLevels: areAudioLevelsEnabled(state)
    };
}

const mapDispatchToProps = {
    onClose: toggleAudioSettings,
    setAudioInputDevice: setAudioInputDeviceAndUpdateSettings,
    setAudioOutputDevice: setAudioOutputDeviceAction
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioSettingsPopup);
