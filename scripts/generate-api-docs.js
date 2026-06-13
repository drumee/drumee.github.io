#!/usr/bin/env node
/**
 * Drumee ACL Documentation Generator
 * 
 * Parses ACL JSON files and generates comprehensive
 * API documentation in Markdown format for Docusaurus.
 * 
 * Usage:
 *   node generate-api-docs.js <module>          # Generate single module
 *   node generate-api-docs.js --all             # Generate all modules
 *   node generate-api-docs.js --acl <dir>       # Specify ACL directory
 *   node generate-api-docs.js --output <dir>    # Specify output directory
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  aclDir: path.join(__dirname, '../acl'),
  outputDir: path.join(__dirname, '../docs/api-reference/backend-sdk'),
  templateDir: path.join(__dirname, '../docs-templates')
};

// HELPER FUNCTIONS //

/**
 * Escape text for MDX to prevent JSX interpretation
 */
function escapeForMDX(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  // Escape curly braces ({ } → \{ \}) so MDX doesn't treat them as JS expressions,
  // and angle brackets (< > → &lt; &gt;) so MDX doesn't treat them as JSX tags
  // (e.g. "MEMBER (<31)" or "<hub>.read_channel" in ACL doc text).
  return text
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Load ACL JSON file
 */
function loadACL(moduleName) {
  const filePath = path.join(CONFIG.aclDir, `${moduleName}.json`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`ACL file not found: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Get all ACL files
 */
function getAllModules() {
  const files = fs.readdirSync(CONFIG.aclDir);
  return files
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort();
}

/**
 * Format permission level
 */
function formatPermission(perm) {
  // Permission bit values, per server-essentials/lib/lex/permission.js:
  //   owner=0b100000(32) admin=0b010000(16) write/delete/modify/upload=0b001000(8)
  //   get/download=0b000100(4) chat=0b000110(6) read/view=0b000010(2)
  //   anonymous/anyone/guest=0b000001(1)
  const levels = {
    'owner': 'Owner (32)',
    'admin': 'Admin (16)',
    'delete': 'Delete (8)',
    'write': 'Write (8)',
    'modify': 'Modify (8)',
    'upload': 'Upload (8)',
    'get': 'Get (4)',
    'download': 'Download (4)',
    'chat': 'Chat (6)',
    'read': 'Read (2)',
    'view': 'View (2)',
    'anonymous': 'Anonymous (1)',
    'anyone': 'Anyone (1)',
    'guest': 'Guest (1)'
  };
  return levels[perm] || perm;
}

/**
 * Format scope type
 */
function formatScope(scope) {
  const scopes = {
    'hub': 'Hub (requires hub context)',
    'domain': 'Domain (requires authentication)',
    'plateform': 'Platform (cross-organisation; spelling per code)'
  };
  return scopes[scope] || scope;
}

/**
 * Format parameter type with constraints
 */
function formatParamType(param) {
  let type = param.type || 'any';
  
  // Handle array types with item specification
  if (type === 'array' && param.items) {
    const itemType = param.items.type || 'any';
    type = `array<${itemType}>`;
  }
  
  // Add enum values
  if (param.enum) {
    type += ` (${param.enum.join(', ')})`;
  } 
  // Add pattern validation
  else if (param.pattern) {
    type += ` (pattern: \`${param.pattern}\`)`;
  }
  // Add string length constraints
  else if (param.minLength || param.maxLength) {
    const constraints = [];
    if (param.minLength) constraints.push(`min: ${param.minLength}`);
    if (param.maxLength) constraints.push(`max: ${param.maxLength}`);
    if (constraints.length) type += ` (${constraints.join(', ')})`;
  } 
  // Add number range constraints
  else if (param.min !== undefined || param.max !== undefined) {
    const constraints = [];
    if (param.min !== undefined) constraints.push(`min: ${param.min}`);
    if (param.max !== undefined) constraints.push(`max: ${param.max}`);
    if (constraints.length) type += ` (${constraints.join(', ')})`;
  }
  
  return type;
}

// MARKDOWN GENERATION //

/**
 * Generate parameter table
 */
function generateParamsTable(params) {
  if (!params || Object.keys(params).length === 0) {
    return '*No parameters*\n\n';
  }
  
  let md = '| Parameter | Type | Required | Default | Description |\n';
  md += '|-----------|------|----------|---------|-------------|\n';
  
  for (const [name, spec] of Object.entries(params)) {
    const type = formatParamType(spec);
    const required = spec.required ? '**Yes**' : 'No';
    const defaultVal = spec.default !== undefined ? `\`${JSON.stringify(spec.default)}\`` : '-';
    const doc = escapeForMDX(spec.doc) || '-';
    
    md += `| \`${name}\` | \`${type}\` | ${required} | ${defaultVal} | ${doc} |\n`;
  }
  
  md += '\n';
  return md;
}

/**
 * Generate return fields table with nested property support
 */
function generateReturnsTable(returns, prefix = '') {
  if (!returns || Object.keys(returns).length === 0) {
    return '*Return structure not documented*\n\n';
  }
  
  let md = '';
  
  // Only add table header if this is the root level
  if (prefix === '') {
    md += '| Field | Type | Description |\n';
    md += '|-------|------|-------------|\n';
  }
  
  for (const [name, spec] of Object.entries(returns)) {
    const fieldName = prefix ? `${prefix}.${name}` : name;
    let type = spec.type || 'any';
    
    // Handle array types
    if (spec.items) {
      const itemType = spec.items.type || 'object';
      type = `array<${itemType}>`;
    } else if (spec.properties) {
      type = 'object';
    }
    
    const doc = escapeForMDX(spec.doc) || '-';
    md += `| \`${fieldName}\` | \`${type}\` | ${doc} |\n`;
    
    // Recursively add nested properties
    if (spec.properties) {
      for (const [nestedName, nestedSpec] of Object.entries(spec.properties)) {
        const nestedFieldName = `${fieldName}.${nestedName}`;
        const nestedType = nestedSpec.type || 'any';
        const nestedDoc = escapeForMDX(nestedSpec.doc) || '-';
        md += `| \`${nestedFieldName}\` | \`${nestedType}\` | ${nestedDoc} |\n`;
      }
    }
    
    // Expand array item properties with [] notation
    if (spec.items && spec.items.properties) {
      for (const [itemName, itemSpec] of Object.entries(spec.items.properties)) {
        const itemFieldName = `${fieldName}[].${itemName}`;
        const itemType = itemSpec.type || 'any';
        const itemDoc = escapeForMDX(itemSpec.doc) || '-';
        md += `| \`${itemFieldName}\` | \`${itemType}\` | ${itemDoc} |\n`;
      }
    }
  }
  
  md += '\n';
  return md;
}

/**
 * Generate errors table
 */
function generateErrorsTable(errors) {
  if (!errors || errors.length === 0) {
    return '*Error codes not documented*\n\n';
  }
  
  let md = '| Error Code | HTTP Status | Description |\n';
  md += '|------------|-------------|-------------|\n';
  
  for (const error of errors) {
    const code = `\`${error.code}\``;
    const status = error.http_status || '-';
    const message = escapeForMDX(error.doc || error.message) || '-';
    
    md += `| ${code} | ${status} | ${message} |\n`;
  }
  
  md += '\n';
  return md;
}

/**
 * Generate examples section
 */
function generateExamples(examples) {
  if (!examples || examples.length === 0) {
    return '';
  }
  
  let md = '### Examples\n\n';
  
  for (const example of examples) {
    md += `#### ${escapeForMDX(example.title)}\n\n`;
    
    if (example.description) {
      md += `${escapeForMDX(example.description)}\n\n`;
    }
    
    if (example.request) {
      md += '**Request:**\n';
      md += '```json\n';
      md += JSON.stringify(example.request, null, 2);
      md += '\n```\n\n';
    }
    
    if (example.response) {
      md += '**Response:**\n';
      md += '```json\n';
      md += JSON.stringify(example.response, null, 2);
      md += '\n```\n\n';
    }
  }
  
  return md;
}

/**
 * Generate service method documentation
 */
function generateMethodDoc(moduleName, methodName, config, allServices) {
  let md = `## ${moduleName}.${methodName}\n\n`;
  
  // Handle method aliases
  if (config.method && !config.doc) {
    const targetMethod = config.method;
    md += `*Alias for [\`${targetMethod}\`](#${moduleName.toLowerCase()}${targetMethod.toLowerCase()})*\n\n`;
    md += '---\n\n';
    return md;
  }
  
  const description = escapeForMDX(config.doc) || '*No description provided*';
  md += `${description}\n\n`;
  
  // Metadata table
  md += '| Property | Value |\n';
  md += '|----------|-------|\n';
  md += `| **Scope** | ${formatScope(config.scope)} |\n`;
  md += `| **Permission** | ${formatPermission(config.permission?.src || 'unknown')} |\n`;
  
  // Add preproc checker if present (may be a string or an object with a `checker` field)
  const preproc = config.permission?.preproc;
  const preprocChecker = typeof preproc === 'string' ? preproc : preproc?.checker;
  if (preprocChecker) {
    md += `| **Pre-check** | \`${preprocChecker}\` (validation before execution) |\n`;
  }
  
  if (config.log) {
    md += `| **Logging** | Enabled |\n`;
  }
  md += '\n';
  
  // URL — unauthenticated (public-api) services are served under /-/api/, the rest under /-/svc/
  const scopePrefix = config.permission?.fast_check === 'public-api' ? 'api' : 'svc';
  md += '**Endpoint:**\n';
  md += `\`\`\`\nhttps://hostname/-/${scopePrefix}/${moduleName}.${methodName}\n\`\`\`\n\n`;
  
  // Parameters
  if (config.params) {
    md += '### Parameters\n\n';
    md += generateParamsTable(config.params);
  }
  
  // Returns
  if (config.returns) {
    md += '### Returns\n\n';
    md += generateReturnsTable(config.returns);
  }
  
  // Errors
  if (config.errors) {
    md += '### Possible Errors\n\n';
    md += generateErrorsTable(config.errors);
  }
  
  // Examples
  if (config.examples) {
    md += generateExamples(config.examples);
  }
  
  md += '---\n\n';
  
  return md;
}

/**
 * Generate complete module documentation
 */
function generateModuleDoc(moduleName) {
  console.log(`Generating documentation for ${moduleName}...`);
  
  const acl = loadACL(moduleName);
  
  let md = `---
id: ${moduleName}
title: ${moduleName} API
sidebar_label: ${moduleName}
---

# ${moduleName.toUpperCase()} API Reference

`;
  
  // Module description
  if (acl.doc) {
    md += `${escapeForMDX(acl.doc)}\n\n`;
  }
  
  // Module info
  md += '## Module Information\n\n';
  md += `**Service Files:**\n`;
  if (acl.modules?.private) {
    md += `- Private: \`${acl.modules.private}.js\`\n`;
  }
  if (acl.modules?.public) {
    md += `- Public: \`${acl.modules.public}.js\`\n`;
  }
  md += '\n';
  
  // Service count
  const serviceCount = Object.keys(acl.services || {}).length;
  const enhancedCount = Object.values(acl.services || {}).filter(s => s.params || s.returns || s.errors).length;
  md += `**Available Services:** ${serviceCount}\n`;
  md += `**Documented Services:** ${enhancedCount}\n\n`;
  
  md += '---\n\n';
  
  // Generate each service method
  for (const [methodName, config] of Object.entries(acl.services || {})) {
    md += generateMethodDoc(moduleName, methodName, config, acl.services);
  }
  
  // Footer
  md += '## Related Documentation\n\n';
  md += '- [ACL System](../../technology/02-acl-system.md) - Permission model\n';
  md += '- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference\n';
  md += '- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed\n';
  md += '- [Error Handling](../../product-guides/05-error-handling.md) - Error codes\n';
  
  return md;
}

/**
 * Write markdown to file
 */
function writeDoc(moduleName, content) {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  const outputPath = path.join(CONFIG.outputDir, `${moduleName}.md`);
  fs.writeFileSync(outputPath, content, 'utf8');
  
  console.log(`Generated: ${outputPath}`);
}

/**
 * Generate index file with all modules
 */
function generateIndex(modules) {
  let md = `---
id: index
title: API Reference
sidebar_label: Overview
---

# Drumee Backend API Reference

Complete API documentation for all Drumee backend services.

## Available Modules

`;
  
  // Group modules by category
  const categories = {
    'Core': ['mfs', 'media', 'desk', 'hub'],
    'User Management': ['drumate', 'contact', 'authn'],
    'Collaboration': ['chat', 'channel', 'conference', 'room'],
    'Import/Export': ['dropbox', 'google_drive', 'mfs_import'],
    'Administration': ['admin', 'permission', 'subscription'],
    'Other': []
  };
  
  // Categorize modules
  const categorized = new Set();
  for (const [category, moduleList] of Object.entries(categories)) {
    if (category === 'Other') continue;
    
    const filtered = modules.filter(m => moduleList.includes(m));
    if (filtered.length === 0) continue;
    
    md += `### ${category}\n\n`;
    for (const module of filtered) {
      md += `- [${module}](./${module}.md)\n`;
      categorized.add(module);
    }
    md += '\n';
  }
  
  // Add uncategorized to Other
  const uncategorized = modules.filter(m => !categorized.has(m));
  if (uncategorized.length > 0) {
    md += `### Other\n\n`;
    for (const module of uncategorized) {
      md += `- [${module}](./${module}.md)\n`;
    }
    md += '\n';
  }
  
  md += `## Quick Links

- [Getting Started](../../getting-started/01-starter-kit.md)
- [Technology Overview](../../technology/01-overview.md)
- [Creating a Service](../../product-guides/02-creating-service.md)

## Documentation Format

Each module page includes:
- **Service Description** - What the service does
- **Parameters** - Input parameters with types and validation
- **Returns** - Response structure
- **Errors** - Possible error codes
- **Examples** - Usage examples with request/response

## Need Help?

- Check [Troubleshooting Guide](../../resources/03-troubleshooting.md)
- Review [Configuring ACL Permissions](../../product-guides/04-acl-permissions.md)
- See [Error Handling](../../product-guides/05-error-handling.md)
`;
  
  const indexPath = path.join(CONFIG.outputDir, 'index.md');
  fs.writeFileSync(indexPath, md, 'utf8');
  console.log(`Generated index: ${indexPath}`);
}

// MAIN //

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage:');
    console.error('  node generate-api-docs.js <module>');
    console.error('  node generate-api-docs.js --all');
    console.error('  node generate-api-docs.js --acl <dir>');
    console.error('  node generate-api-docs.js --output <dir>');
    process.exit(1);
  }
  
  let modules = [];
  let generateAll = false;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--all') {
      generateAll = true;
    } else if (args[i] === '--acl' && i + 1 < args.length) {
      CONFIG.aclDir = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      CONFIG.outputDir = path.resolve(args[i + 1]);
      i++;
    } else if (!args[i].startsWith('--')) {
      modules.push(args[i]);
    }
  }
  
  // Get modules to process
  if (generateAll) {
    modules = getAllModules();
  }
  
  if (modules.length === 0) {
    console.error('No modules specified');
    process.exit(1);
  }
  
  console.log(`\nDrumee API Documentation Generator\n`);
  console.log(`ACL directory:    ${CONFIG.aclDir}`);
  console.log(`Output directory: ${CONFIG.outputDir}`);
  console.log(`Modules to process: ${modules.length}\n`);
  
  // Generate documentation
  let success = 0;
  let failed = 0;
  
  for (const module of modules) {
    try {
      const content = generateModuleDoc(module);
      writeDoc(module, content);
      success++;
    } catch (error) {
      console.error(`Error generating ${module}:`, error.message);
      failed++;
    }
  }
  
  // Generate index
  if (generateAll) {
    generateIndex(modules);
  }
  
  console.log(`\nComplete: ${success} succeeded, ${failed} failed\n`);
}

if (require.main === module) {
  main();
}

module.exports = {
  generateModuleDoc,
  loadACL,
  getAllModules
};