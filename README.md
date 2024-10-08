# react-chariot-connect

## Install
```
npm install --save react-chariot-connect
```
or
```
yarn add react-chariot-connect
```

## Usage
```jsx
import React, { useState } from 'react';
import ChariotConnect from 'react-chariot-connect';

const App = () => {
  const onSuccess = (e) => console.log('success', e);
  const onExit = (e) => console.log('exit', e);
  const onError = (e) => console.log('error', e);
  const onDonationRequest = ({ detail }) => {
    // your logic
  }

  return (
    <div>
        <ChariotConnect
          cid="GENERATED_CONNECT_IDENTIFIER"
          theme="GradientTheme"
          onDonationRequest={onDonationRequest}
          onSuccess={onSuccess}
          onExit={onExit}
          onError={onError}
        />
    </div>
  );
};
```

### Attributes
| Attribute name    | Type             | Description                                                              |
| ----------------- | ---------------- | ------------------------------------------------------------------------ |
| cid               | string           | Retrieve a nonprofit's `cid` by calling the [Create Connect API](https://givechariot.readme.io/reference/create-connect).|
| theme             | ChariotTheme \| CustomTheme | (optional) Modify the button theme based on the [Chariot Connect API documentation](https://docs.givechariot.com/guides/dafpay/button-styles). Use a preset theme or define your own styling by passing in an Object. |
| onDonationRequest | () => DonationRequestReturnType       | (optional) Provide the Chariot Connect workflow with any information that you have collected for this donation session. More information can be found on the [Chariot Connect API documentation](https://docs.givechariot.com/guides/dafpay/overview). |
| onSuccess         | (e: SuccessEvent) => void | (optional) The success event contains a final summary of the Connect workflow session. It contains the workflow session id and relevant donation information. It is called when a workflow session is completed successfully. |
| onExit            | (e: ExitEvent) => void | (optional) The exit event is called when a user exits without successfully completing the flow, or when an error occurs during the flow. It is called when a workflow session closes without completion. |
| onError           | (e: ErrorEvent) => void | (optional) The error event is called when an error occurs on script load. |


## Documentation
Check out the [documentation](https://docs.givechariot.com/guides/dafpay/overview) for more information.
