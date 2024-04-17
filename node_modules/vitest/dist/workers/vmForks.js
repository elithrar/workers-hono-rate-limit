import v8 from 'node:v8';
import { c as createForksRpcOptions, u as unwrapSerializableConfig } from '../vendor/utils.0uYuCbzo.js';
import { r as runVmTests } from '../vendor/vm.I_IsyNig.js';
import '@vitest/utils';
import 'node:vm';
import 'node:url';
import 'pathe';
import '../chunks/runtime-console.kbFEN7E-.js';
import 'node:stream';
import 'node:console';
import 'node:path';
import '../vendor/date.Ns1pGd_X.js';
import '../vendor/index.ir9i0ywP.js';
import 'std-env';
import '@vitest/runner/utils';
import '../vendor/global.CkGT_TMy.js';
import '../vendor/execute.2_yoIC01.js';
import 'vite-node/client';
import 'vite-node/utils';
import '@vitest/utils/error';
import '../path.js';
import 'node:fs';
import '../vendor/base.Xt0Omgh7.js';
import 'node:module';
import 'vite-node/constants';

class ForksVmWorker {
  getRpcOptions() {
    return createForksRpcOptions(v8);
  }
  async runTests(state) {
    const exit = process.exit;
    state.ctx.config = unwrapSerializableConfig(state.ctx.config);
    try {
      await runVmTests(state);
    } finally {
      process.exit = exit;
    }
  }
}
var vmForks = new ForksVmWorker();

export { vmForks as default };
