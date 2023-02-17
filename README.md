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
  const onDonationRequest = () => {
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
        />
    </div>
  );
};
```

### Attributes
| Attribute name    | Type             | Description                                                              |
| ----------------- | ---------------- | ------------------------------------------------------------------------ |
| cid               | string           | Retrieve a nonprofit's `cid` by calling the [Create Connect API](https://givechariot.readme.io/reference/create-connect).|
| theme             | string \| Object | (optional) Modify the button theme based on the [Chariot Connect API documentation](https://givechariot.readme.io/reference/button-styles). <br />Use a preset theme or define your own styling by passing in an Object. |
| onDonationRequest | () => void       | Provide the Chariot Connect workflow with any information that you have collected <br />for this donation session. More information can be found on the [Chariot Connect API <br />documentation](https://givechariot.readme.io/reference/integrating-connect#provide-donation-data-to-chariot-connect). |
| onSuccess         | (e: any) => void | (optional) The success event contains a final summary of the Connect workflow session. <br />It contains the workflow session id and relevant donation information. It is called when a <br />workflow session is completed successfully. |
| onExit            | (e: any) => void | (optional) The exit event is called when a user exits without successfully completing the <br />flow, or when an error occurs during the flow. It is called when a workflow session closes <br />without completion. |


## Documentation
Check out the [documentation](https://givechariot.readme.io/reference/overview-1) for more information.
