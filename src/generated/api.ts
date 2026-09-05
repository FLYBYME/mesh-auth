// GENERATED FILE — do not edit.
//
// Emitted from auth's exposure descriptor by @flybyme/mesh-api.
// Exposure: sha256:07cf3cfa6d997a8f9f3ff6c58d5dd951
//
// Regenerate rather than editing. The exposure hash above is checked at run time against
// the one the API reports, so a hand-edited client is a client that lies about a surface
// nobody can verify (mesh-web spec/network.md section 6).

import { call, defineApi } from '@flybyme/mesh-web';

export interface IdentityTicketIssueInput {
    readonly email: string;
    readonly password: string;
    readonly via?: string;
}

export interface IdentityTicketIssueOutput {
    readonly token: string;
    readonly userId: string;
    readonly expiresAt: number;
}

export interface IdentityWhoamiOutputOrganization {
    readonly organizationId: string;
    readonly name: string;
    readonly roleKey: string;
}

export interface IdentityWhoamiOutput {
    readonly userId: string;
    readonly email: string;
    readonly displayName: string;
    readonly roles: readonly string[];
    readonly organizations: readonly IdentityWhoamiOutputOrganization[];
}

export const authApi = defineApi({
    id: "auth",
    exposure: "sha256:07cf3cfa6d997a8f9f3ff6c58d5dd951",
    base: "/api",
    calls: {
        /**
         * Exchange credentials for an opaque ticket.
         *
         * POST /identity/ticket — auth: public, destructive
         */
        "identity.ticket_issue": call<IdentityTicketIssueInput, IdentityTicketIssueOutput, never>("POST", "/identity/ticket"),
        /**
         * Who the caller is, and which organizations they belong to.
         *
         * GET /identity/whoami — auth: public
         */
        "identity.whoami": call<void, IdentityWhoamiOutput, never>("GET", "/identity/whoami"),
    },
});
