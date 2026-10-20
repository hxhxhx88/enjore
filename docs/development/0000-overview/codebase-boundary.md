# Codebase boundary

## Core principle

- Application code must be deployment-agnostic.
- The codebase must not assume any specific hosting platform, edge provider, or network topology.
- Deployment-time concerns are handled by deployment infrastructure, not by business application code.

## Why this boundary exists

- It keeps the code portable across different deployment targets.
- It prevents infrastructure coupling from leaking into domain logic.
- It reduces accidental complexity in core product code.
- It creates clear ownership between application engineering and deployment operations.

## What belongs in application code

- Domain and product logic.
- API contracts, schema validation, and data integrity checks.
- Authentication and authorization semantics.
- OTP lifecycle rules, such as generation, expiry, and one-time usage.
- Error handling and observability hooks relevant to business behavior.

## What belongs in deployment infrastructure

- IP-based and global traffic rate limiting.
- WAF, bot filtering, challenge policies, and DDoS mitigation.
- Geo/IP allow or deny rules.
- TLS termination, CDN behavior, edge caching, and network traffic shaping.
- Infrastructure-level request throttling and abuse control policies.

## Lightweight anti-abuse signal

- A simple request signature or similar marker may be used as a low-cost anti-abuse signal.
- This signal is only for friction and telemetry, not strong client verification.
- It must never be treated as an authorization boundary.
- Access control decisions must rely on server-verified authentication and authorization.

## Responsibility model

- The codebase is responsible for correct business behavior.
- The deployment layer is responsible for traffic and infrastructure security controls.
- If a mechanism depends on edge visibility, network identity, or provider capabilities, it belongs to deployment configuration.
