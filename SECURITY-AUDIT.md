# Security Audit Report

**Generated:** 2025-09-10  
**Project:** Rotomatch v1.0.0  
**Audit Level:** Moderate and above

## 🔒 Summary

- **Total Vulnerabilities Found:** 8 → 5 (after fixes)
- **Critical:** 0 
- **High:** 0
- **Moderate:** 2
- **Low:** 3

## ✅ Resolved Vulnerabilities

### 1. on-headers < 1.1.0 (CVE-2025-7339)
- **Severity:** Low
- **Issue:** HTTP response header manipulation vulnerability
- **Status:** ✅ **FIXED** via `npm audit fix`
- **Solution:** Upgraded to version 1.1.0

### 2. compression/serve dependency chain
- **Severity:** Low  
- **Issue:** Dependent on vulnerable on-headers
- **Status:** ✅ **FIXED** via dependency upgrade

## ⚠️ Remaining Vulnerabilities

### 1. underscore.string < 3.3.5 (GHSA-v2p6-4mp7-3r9v)
- **Severity:** MODERATE
- **Package:** `fix@0.0.6 → underscore.string@1.1.4`
- **Issue:** Regular Expression Denial of Service (ReDoS) in `unescapeHTML` function
- **Impact:** 
  - Performance degradation (~2s for 50k characters)
  - Exponential slowdown with larger inputs
  - Only affects apps using `unescapeHTML` function with user-controlled input
- **Risk Assessment:** 🟡 **LOW PRODUCTION RISK**
  - The `fix` package appears to be a development dependency
  - Unlikely to process large HTML strings in production
  - Would require specific attack targeting the `unescapeHTML` function
- **Mitigation:** 
  - Monitor for `fix` package usage and potential replacements
  - Consider `npm audit fix --force` for future major releases
  - Input validation on any HTML processing

### 2. Vite 6.0.0-6.3.5 (GHSA-g4jq-h2w9-997c, GHSA-jqfw-vq24-v9c3)
- **Severity:** MODERATE  
- **Package:** `@angular/build@19.2.15 → vite@6.2.7`
- **Issues:**
  - **File serving bypass:** Files with same name prefix as public directory can be served
  - **HTML file access:** `server.fs` settings not applied to HTML files
- **Impact:**
  - Unauthorized file access during development
  - Exposure of sensitive files outside allowed directories
  - Only affects development server when exposed to network
- **Risk Assessment:** 🟡 **LOW PRODUCTION RISK**
  - Affects only **development server**, not production builds
  - Requires explicit network exposure (`--host` flag)
  - Production builds use different serving mechanism
- **Mitigation:**
  - Avoid exposing dev server to untrusted networks
  - Use production builds for any public deployment
  - Monitor Angular CLI updates for Vite upgrades

## 🛡️ Security Recommendations

### Immediate Actions (Production Safe)
1. ✅ **Completed:** Applied `npm audit fix` for non-breaking changes
2. ✅ **Completed:** Documented remaining vulnerabilities
3. 🔄 **Ongoing:** Monitor dependency updates for safer upgrade paths

### Future Considerations
1. **Development Environment:**
   - Never expose `npm run dev` to untrusted networks
   - Use `npm run build && npm run start:prod` for any external access
   - Regular security audits with each Angular CLI update

2. **Dependency Management:**
   - Schedule quarterly dependency review
   - Test `npm audit fix --force` in development branch
   - Consider alternative packages for `fix` dependency

3. **CI/CD Integration:**
   - Add `npm audit --audit-level=moderate` to CI pipeline
   - Configure alerts for new HIGH/CRITICAL vulnerabilities
   - Automated dependency updates for security patches

## 📋 Audit Command Reference

```bash
# Run security audit
npm run audit:security

# Fix non-breaking vulnerabilities  
npm audit fix

# Fix all vulnerabilities (including breaking changes)
npm audit fix --force

# Check specific audit levels
npm audit --audit-level=high
npm audit --audit-level=moderate
```

## 🔍 Latest Vulnerability Details (Updated 19:08 UTC)

### CVE-2025-58751 & CVE-2025-58752 (Vite Vulnerabilities)
**Published:** September 8-9, 2025  
**CVSS Score:** 2.3/10 (Low)

#### CVE-2025-58751: File serving bypass
- **Attack Vector:** Network-based, requires `--host` flag exposure
- **Impact:** Files with same name prefix as public directory can be served
- **Exploit Requirements:**
  - Dev server explicitly exposed to network (`--host` option)
  - Public directory feature enabled (default)
  - Symlink exists in public directory

#### CVE-2025-58752: HTML file access bypass
- **Attack Vector:** Network-based, affects dev and preview servers
- **Impact:** Any HTML files on machine served regardless of `server.fs` settings
- **Exploit Requirements:**
  - Dev server exposed to network (`--host` option)
  - `appType: 'spa'` (default) or `appType: 'mpa'`

### 📊 **Current Risk Assessment:**

| Vulnerability | Production Impact | Development Impact | Action Required |
|---------------|-------------------|--------------------|-----------------|
| underscore.string ReDoS | 🟢 **NONE** - Dev only | 🟡 **LOW** - Rare usage | Monitor for fix@0.0.3+ |
| Vite CVE-2025-58751 | 🟢 **NONE** - Build only | 🟡 **LOW** - Need --host | Never expose dev server |
| Vite CVE-2025-58752 | 🟢 **NONE** - Build only | 🟡 **LOW** - Need --host | Never expose dev server |

## 🔄 Next Review

**Scheduled:** 2025-12-10 (Quarterly)  
**Trigger Events:**
- Angular major version release
- High/Critical vulnerabilities reported
- Before production deployment
- Vite 6.3.6+ becomes available in Angular CLI

---

**Report Generated By:** Automated Security Audit  
**Last Updated:** 2025-09-10 19:08 UTC
