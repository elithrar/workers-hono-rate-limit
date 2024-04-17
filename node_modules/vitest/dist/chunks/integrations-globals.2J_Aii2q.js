import { g as globalApis } from '../vendor/constants.5J7I254_.js';
import { V as VitestIndex } from '../vendor/index.12jbrDSD.js';
import '@vitest/runner';
import '../vendor/benchmark.eeqk2rd8.js';
import '@vitest/runner/utils';
import '@vitest/utils';
import '../vendor/index.ir9i0ywP.js';
import 'pathe';
import 'std-env';
import '../vendor/global.CkGT_TMy.js';
import '../vendor/run-once.Olz_Zkd8.js';
import '../vendor/vi.Fxjax7rQ.js';
import 'chai';
import '../vendor/_commonjsHelpers.jjO7Zipk.js';
import '@vitest/expect';
import '@vitest/snapshot';
import '@vitest/utils/error';
import '../vendor/tasks.IknbGB2n.js';
import '@vitest/utils/source-map';
import '../vendor/base.Xt0Omgh7.js';
import '../vendor/date.Ns1pGd_X.js';
import '@vitest/spy';

function registerApiGlobally() {
  globalApis.forEach((api) => {
    globalThis[api] = VitestIndex[api];
  });
}

export { registerApiGlobally };
