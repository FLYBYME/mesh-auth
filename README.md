# mesh-auth

The auth Extension. It holds the session, attaches the ticket, and hands no credential to anyone.

**One Extension per site.** A site is a hostname is an origin, it talks to one API address, and every
Application on that page therefore talks to the same API. One session for that API is the right
shape, not a compromise.

## Why this is its own repository

It used to be 293 lines inside `@flybyme/mesh-web`, exported from the kernel — while its own
documentation described it as *site-supplied* rather than built in. Both could not be true, and a
blog that never signs anyone in was carrying a session implementation regardless.

It is also the **first part extracted**, deliberately. Almost every site needs auth, so if an
Extension cannot be built, published, resolved and loaded, this is where that shows up rather than
somewhere it can be worked around.

## What an Application sees

Nothing. An Application declares `needs('mesh')`, calls `cx.mesh.call(...)`, and the ticket is on the
request. It cannot read the ticket, cannot attach a different one, and cannot tell whether there is
one — which is the whole of *an Application never handles a credential*.

An Application that wants the session names the token instead:

```ts
consumes(AUTH)   // → { session, signIn, signOut }
```

`AuthApi` deliberately has no way to get the ticket. The moment a consumer can read it, "the auth
Extension attaches the ticket" becomes advice rather than a property.

## What the site chooses

```ts
new AuthExtension({
    endpoints: { issue: '/api/identity/ticket', whoami: '/api/identity/whoami' },
    store: sessionTicketStore('my-site/ticket'),
})
```

**`store` is undefined by default, and that is a decision.** With no store, a reload signs you out.
A framework that silently persisted a credential would be making a security choice on the site's
behalf. `sessionTicketStore` is offered and scoped to the tab; `localStorage` is deliberately not the
default, because it outlives the tab and is readable by every script on the origin.

**Endpoints are a parameter, not a generated client.** mesh-identity's REST paths are the usual
answer and not the only possible one — a site may point this at any identity that answers the three
shapes it uses.

## Building

There is no build here. `mesh.json` names the entry; the builder runs esbuild with
`@flybyme/mesh-web` external, and the page's import map resolves it to the one mounted kernel.
A part artifact must never contain a copy of the kernel — two copies under two URLs are two module
graphs and two of every singleton the capability model depends on.

`@flybyme/mesh-web` is a devDependency for typechecking only:

```bash
npm run typecheck
```

esbuild strips types and never checks them, so that is this repository's job before it pushes.
