
1. Retrieve stored **Identity** by invoking the **`retrieveIdentity()`** function from the **`identityService`**. 

```js
import { ServiceFactory } from '../factories/serviceFactory';  
```

```js
const identityService = ServiceFactory.get('identity');
const storedIdentity = await identityService.retrieveIdentity();
```

1. Retrieve stored **Credential** from the Keychain. 

```js
const storedCredential = await identityService.retrieveCredential('credentialId');
```

3. Generate a new verifiable presentation by invoking the **`createVerifiablePresentation(identiy, credentialDocument)`** function from the **`identityService`**.  

Please use the `storedIdentity` from the **Step 1**

```js
const verifiablePresentation = await identityService.createVerifiablePresentation(storedIdentity, storedCredential.credentialDocument);

const verifiablePresentationJSON = JSON.stringify(verifiablePresentation, null, 2);
```