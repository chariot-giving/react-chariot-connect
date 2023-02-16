import React, { useEffect } from 'react'

const noop = () => { }

type ChariotConnectProps = {
    cid: string,
    theme?: string | Object,
    onDonationRequest: () => void,
    onSuccess?: (e: any) => void,
    onExit?: (e: any) => void,
}

const ChariotConnect: React.FC<ChariotConnectProps> = ({
    cid,
    theme = "DefaultTheme",
    onDonationRequest,
    onSuccess = noop,
    onExit = noop,
}) => {
    useEffect(() => {
        const script = document.createElement('script');

        // change this to https://cdn.givechariot.com/chariot-connect.umd.js
        // once CHARIOT_INIT event is added to prod
        script.src = "http://127.0.0.1:5173/dist/chariot-connect.umd.js";
        script.async = true;

        document.body.appendChild(script);

        const connect = document.createElement('chariot-connect') as any;
        connect.setAttribute('cid', cid);
        connect.setAttribute('theme', (typeof theme === "string") ? theme : 'customTheme')

        connect.addEventListener("CHARIOT_INIT", () => {
            connect.onDonationRequest(onDonationRequest);
            connect.registerTheme("customTheme", theme);
        });

        connect.addEventListener("CHARIOT_SUCCESS", onSuccess)
        connect.addEventListener("CHARIOT_EXIT", onExit)

        const connectContainer = document.getElementById('connectContainer');
        connectContainer?.appendChild(connect)

        return () => {
            document.body.removeChild(script);
            connectContainer?.removeChild(connect);
        }
    }, []);

    return (
        <div id="connectContainer">
        </div>
    )
}

export default ChariotConnect