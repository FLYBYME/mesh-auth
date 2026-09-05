/**
 * The auth Extension, in a real browser.
 *
 * **The first test this part has ever had.** It could be built, published and served, and nothing
 * could assert that it activates — the only way to find out was to open a page and look, which is
 * exactly the state the browser-testing harness exists to end.
 *
 * It runs through `mountPart`, which boots through the kernel's `start()` — the same path a deployed
 * site takes. A test harness that booted a part its own way would be testing something that does not
 * ship, which is how this framework's previous harness became a fixture pretending to be a
 * deployment.
 */

import { AUTH, type AuthApi } from '../src/index.js';
import { mountPart } from '@flybyme/mesh-web/testing';
import AuthExtension from '../src/index.js';
import { describe, expect, it } from 'vitest';

describe('the auth Extension', () => {
    it('activates and provides a session', async () => {
        const site = await mountPart({
            parts: [{ id: 'auth', contribution: AuthExtension }],
        });

        const auth = site.kernel.provided(AUTH);
        expect(auth).toBeDefined();

        site.dispose();
    });

    it('starts with nobody signed in', async () => {
        // A held ticket is a claim, never a session — and with no store there is no held ticket, so
        // a reload signs you out. That is the safe default and a real choice for a console.
        const site = await mountPart({
            parts: [{ id: 'auth', contribution: AuthExtension }],
        });

        const auth = site.kernel.provided(AUTH) as AuthApi;
        expect(auth.session()).toBeNull();

        site.dispose();
    });

    it('takes the options a site gives it', async () => {
        // The case that made a part's default export a constructor rather than an instance: which
        // identity API this Extension talks to is the *site's* decision, so the package cannot
        // construct itself. This is also the shape that PartRef's first type rejected outright.
        const site = await mountPart({
            parts: [{
                id: 'auth',
                contribution: AuthExtension,
                options: { endpoints: { whoami: '/somewhere-else/whoami' } },
            }],
        });

        expect(site.kernel.provided(AUTH)).toBeDefined();
        site.dispose();
    });

    it('holds the page credential seam, and says so in its manifest', async () => {
        // `needs('credentials')` is what makes "the auth Extension attaches the ticket" visible to
        // whoever composes a site, rather than something they have to take on trust.
        const site = await mountPart({
            parts: [{ id: 'auth', contribution: AuthExtension }],
        });

        expect(new AuthExtension().needs).toContain('credentials');
        // And `http`, because this file called global fetch until the capability existed — network
        // access nobody granted and nobody could see.
        expect(new AuthExtension().needs).toContain('http');

        site.dispose();
    });
});
