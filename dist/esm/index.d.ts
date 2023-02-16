import React from 'react';
type ChariotConnectProps = {
    cid: string;
    theme?: string | Object;
    onDonationRequest: () => void;
    onSuccess?: (e: any) => void;
    onExit?: (e: any) => void;
};
declare const ChariotConnect: React.FC<ChariotConnectProps>;
export default ChariotConnect;
