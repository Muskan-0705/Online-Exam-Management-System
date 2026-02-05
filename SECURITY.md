# Security Policy

## Overview
This document outlines the security measures implemented in the Online Examination Management System.

## Security Features Implemented

### 1. **Environment Variables Protection** ✅
- `.env` file is added to `.gitignore` to prevent credentials from being committed
- `.env.example` provides template without actual credentials
- Environment variable validation on server startup

### 2. **HTTP Headers Security** ✅
- **Helmet.js** - Sets secure HTTP response headers
  - Prevents clickjacking attacks
  - Controls MIME type sniffing
  - Disables caching for sensitive data
  - Implements CSP (Content Security Policy)

### 3. **Database Security** ✅
- **MongoDB Sanitization** - `express-mongo-sanitize`
  - Prevents NoSQL injection attacks
  - Cleans data before database operations
- **Password Hashing** - `bcryptjs`
  - Passwords are hashed with salt rounds = 10
  - Never stored in plain text

### 4. **API Security** ✅
- **CORS** (Cross-Origin Resource Sharing)
  - Whitelist only trusted origins
  - Restrict HTTP methods to necessary ones
  - Control allowed headers
- **Rate Limiting**
  - General API limit: 100 requests per 15 minutes
  - Auth routes limit: 5 login attempts per 15 minutes
  - Prevents brute force attacks and DDoS

### 5. **Input Validation** ✅
- Request body size limit: 10KB
- JSON parsing with size restrictions
- Input sanitization in MongoDB queries

### 6. **JWT Security** ✅
- Tokens signed with strong secret key (JWT_SECRET)
- Tokens verified on every protected route
- Token expiration can be configured
- Tokens stored securely in frontend

### 7. **HTTPS/TLS** ✅
- Configure in production environment
- Use only HTTPS for data in transit
- Secure cookies with httpOnly and secure flags

## Security Best Practices

### For Development
```bash
# Check for vulnerable dependencies
npm audit

# Fix identified vulnerabilities
npm audit fix

# Update dependencies regularly
npm update
```

### For Deployment
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET (minimum 32 characters)
3. Configure ALLOWED_ORIGINS for production domain
4. Enable HTTPS/TLS
5. Use environment variable manager (AWS Secrets Manager, Azure Key Vault)
6. Regular security updates

### API Endpoints Protection
- All routes require JWT token in Authorization header
- Role-based access control implemented
- User ID verification to prevent unauthorized access

## Vulnerability Reporting

### Found a Security Issue?
1. **DO NOT** open a public GitHub issue
2. Email security details to: [security contact email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline
- Initial response: Within 24 hours
- Security patch: Within 7 days
- Public disclosure: After patch release

## Dependencies Security

### Current Security Packages
- `helmet` - Secure HTTP headers
- `express-mongo-sanitize` - NoSQL injection prevention
- `express-rate-limit` - Rate limiting
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### Regular Updates
Keep dependencies updated:
```bash
npm outdated       # Check outdated packages
npm update         # Update packages
npm audit          # Check for vulnerabilities
npm audit fix      # Auto-fix vulnerabilities
```

## Security Checklist

### Before Going to Production ✅
- [ ] Change all default credentials
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/TLS
- [ ] Set NODE_ENV=production
- [ ] Run `npm audit` and fix issues
- [ ] Review and test all API endpoints
- [ ] Implement CSRF tokens if needed
- [ ] Set up rate limiting properly
- [ ] Configure MongoDB IP whitelist
- [ ] Enable database encryption at rest
- [ ] Set up security logging and monitoring
- [ ] Regular backup strategy
- [ ] Incident response plan

## Database Security (MongoDB Atlas)

### IP Whitelist
- Only whitelist necessary IP addresses
- Use VPN/fixed IPs in production
- Regularly audit access logs

### Authentication
- Use strong database passwords
- Enable database user role restrictions
- Regular password rotation

## Authentication Best Practices

### Password Policy
- Minimum length: 8 characters
- Enforce strong passwords during user creation
- Hash with bcryptjs (salt rounds: 10)

### Session Management
- JWT tokens expire after configured time
- Invalidate tokens on logout
- Clear tokens on frontend

### Monitoring
- Log all authentication attempts
- Alert on failed login attempts
- Track user activity

## Compliance

This system implements:
- ✅ OWASP Top 10 protections
- ✅ GDPR data protection (where applicable)
- ✅ Basic encryption standards
- ✅ Secure coding practices

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security-checklist/)

## Version
- Last Updated: February 2026
- Security Policy Version: 1.0

---
**Note**: This security policy is a living document. It will be updated as new threats emerge and best practices evolve.
