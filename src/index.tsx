import React, { useEffect } from 'react'
import useScript from 'react-script-hook';

const noop = () => { }

type ChariotConnectProps = {
    cid: string,
    theme?: string | Object,
    onDonationRequest: () => Object,
    onSuccess?: (e: any) => void,
    onExit?: (e: any) => void,
    disabled?: boolean,
}

const ChariotConnect: React.FC<ChariotConnectProps> = ({
    cid,
    theme = "DefaultTheme",
    onDonationRequest,
    onSuccess = noop,
    onExit = noop,
    disabled = false,
}) => {
    useScript({ src: 'https://cdn.givechariot.com/chariot-connect.umd.js' });
    useEffect(() => {
        const connect = document.createElement('chariot-connect') as any;
        connect.setAttribute('cid', cid);
        connect.setAttribute('theme', (typeof theme === "string") ? theme : 'customTheme');
        if (disabled) {
            connect.setAttribute('disabled', '');
        }

        connect.addEventListener("CHARIOT_INIT", () => {
            connect.onDonationRequest(onDonationRequest);
            connect.registerTheme("customTheme", theme);
        });

        connect.addEventListener("CHARIOT_SUCCESS", onSuccess)
        connect.addEventListener("CHARIOT_EXIT", onExit)

        const connectContainer = document.getElementById('connectContainer');
        connectContainer?.appendChild(connect)

        return () => {
            connectContainer?.removeChild(connect);
        }
    }, [onDonationRequest]);

    return (
        <div id="connectContainer">
        </div>
    )
}

export default ChariotConnect