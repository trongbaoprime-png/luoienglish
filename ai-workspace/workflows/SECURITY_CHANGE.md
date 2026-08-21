# Security Change Workflow (R3 Risk)

1. **Explicit Human Approval**: All R3 security tasks require human confirmation prior to implementation.
2. **Threat Modeling**: Analyze child privacy, auth token exposure, rate limit bypass, and data leak risks.
3. **Implementation**: Implement defense-in-depth measures.
4. **Security Review**: Verify zero client-side credential exposure, strict COPPA-compliant child boundaries.
5. **Acceptance**: Human approval required before merging.
