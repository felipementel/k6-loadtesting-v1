import GetAuthPortais from './scenarios/auth-Portais.js';
import { group, sleep } from 'k6';

export default () => {
  group('AuthPortais', () => {
    GetAuthPortais();
  });

  sleep(1);
};
