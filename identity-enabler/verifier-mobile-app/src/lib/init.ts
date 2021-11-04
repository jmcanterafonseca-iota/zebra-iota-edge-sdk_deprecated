import { ServiceFactory } from '../factories/serviceFactory';
import { IdentityService } from '../services/identityService';
import { IOTA_NODE_URL, DEVNET } from '../config';

export default () => {
  ServiceFactory.register('identity', () => new IdentityService(DEVNET, IOTA_NODE_URL));
};
