
1. Initialize the **`identityService`** on application start

```js
import { ServiceFactory } from '../factories/serviceFactory';
import { IdentityService } from '../services/identityService';
import { IOTA_NODE_URL, DEVNET } from '../config';


export default () => {
      ServiceFactory.register('identity', () => new IdentityService(DEVNET, IOTA_NODE_URL));  
}
```

2. Generate a new Identity by invoking the **`createIdentity()`** function from the **`identityService`**.

```js
import { ServiceFactory } from '../factories/serviceFactory';

try {
      const identityService = ServiceFactory.get('identity');

      const identity = await identityService.createIdentity();

      await identityService.storeIdentity('did', identity);
} catch (err) {
      error.set('Error creating identity.');
}
```

3. You can also load an existing Identity from internal Application Storage

```js
import { onMount } from 'svelte';
import { ServiceFactory } from './factories/serviceFactory';

onMount(async () => {
      const identityService = ServiceFactory.get('identity');

      const storedIdentity = await identityService.retrieveIdentity();
});
```
