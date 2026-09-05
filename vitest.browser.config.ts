/**
 * Browser tests for this part.
 *
 * The whole file is a call into the framework, which is the point: the configuration that makes a
 * part testable — resolving `@flybyme/mesh-web` to exactly one copy, a real Chrome rather than
 * jsdom, a viewport big enough that a window is not clamped to nothing — is the framework's
 * knowledge, not this repository's. A part author who had to write it would be copying thirty lines
 * they cannot evaluate.
 */

import { definePartBrowserConfig } from '@flybyme/mesh-web/testing/config';

export default definePartBrowserConfig();
