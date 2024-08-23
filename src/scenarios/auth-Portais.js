import { check, fail, sleep } from 'k6';
import http from 'k6/http';
import { Trend, Rate, Counter } from 'k6/metrics';

export let GetAuthDuration = new Trend('auth_duration');
export let GetAuthFailRate = new Rate('auth_fail_rate');
export let GetAuthSuccessRate = new Rate('auth_success_rate');
export let GetAuthReqs = new Rate('auth_requests');

export default function () {
  let url = 'https://localhost:4300/api/AuthB2CPortais/tokenapp';
  let headers = {
    'Content-Type': 'application/json',
    PortalName: 'Parametro1',
    authorization: 'Bearer 123',
    client_id: '06d6c03d6203-xxx',
    client_secret: 'FUO8Q~zl_yyy',
    'subscription-key': 'abc123',
  };
  let body = JSON.stringify({
    usuario: {
      login: '123',
      senha: 'abc',
    },
  });

  let res = http.post(url, body, { headers: headers });

  GetAuthDuration.add(res.timings.duration);
  GetAuthFailRate.add(res.status == 0 || res.status > 399);
  GetAuthSuccessRate.add(res.status < 399);
  GetAuthReqs.add(1);

  const maxDuration = 20000; // Definindo a duração máxima em milissegundos
  let durationMsg = `Max Duration ${maxDuration / 1000}s`;

  if (
    !check(res, {
      'status is 200': (r) => r.status === 200,
      'duration is ok': (r) => r.timings.duration < maxDuration,
    })
  ) {
    fail(durationMsg);
  }

  sleep(1);
}
