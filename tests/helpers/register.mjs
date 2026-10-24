// Registers the custom module-resolution hook BEFORE the test file's imports
// are linked. `node --import ./tests/helpers/register.mjs --test tests/` runs
// this first in every test child process (node:test keeps default process
// isolation, so each test file gets a fresh module registry + env).
import { register } from "node:module";

register("./resolve-hook.mjs", import.meta.url);
