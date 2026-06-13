import React, { useState } from 'react';
import './PermissionVisualizer.css';

// Single permission bits, per server-essentials/lib/lex/permission.js (6-bit word)
const PERMISSIONS = {
  owner: { bit: 32, description: 'Full control over resource' },
  admin: { bit: 16, description: 'Administrative access' },
  write: { bit: 8, description: 'Write, delete, modify or upload' },
  get: { bit: 4, description: 'Download or get the resource' },
  read: { bit: 2, description: 'Read or view resource' },
  anonymous: { bit: 1, description: 'Minimal guest access' },
};

// Composite hub privilege words, per server-essentials/lib/lex/constants.js (PRIV_HUB_*)
const PRIVILEGE_MASKS = {
  owner: 63,        // PRIV_HUB_OWNER   0b111111
  admin: 31,        // PRIV_HUB_ADMIN   0b011111
  manager: 15,      // PRIV_HUB_MANAGER 0b001111
  designer: 7,      // PRIV_HUB_DESIGNER 0b000111
  contributor: 3,   // PRIV_HUB_CONTRIB 0b000011
  guest: 1,         // PRIV_HUB_GUEST   0b000001
};

export default function PermissionBitmaskVisualizer() {
  const [selectedPrivilege, setSelectedPrivilege] = useState<keyof typeof PRIVILEGE_MASKS>('designer');
  const [requiredPermission, setRequiredPermission] = useState<number>(2); // read
  const [customBitmask, setCustomBitmask] = useState<string>('000010');

  const userPrivilege = PRIVILEGE_MASKS[selectedPrivilege];
  const hasPermission = (userPrivilege & requiredPermission) === requiredPermission;

  const permissionBits = Object.entries(PERMISSIONS).map(([name, { bit, description }]) => ({
    name,
    bit,
    description,
    hasPrivilege: (userPrivilege & bit) === bit,
    required: (requiredPermission & bit) === bit,
  }));

  const updateCustomBitmask = (binary: string) => {
    setCustomBitmask(binary);
    const decimal = parseInt(binary, 2);
    if (!isNaN(decimal)) {
      setRequiredPermission(decimal);
    }
  };

  return (
    <div className="permission-visualizer">
      <div className="controls">
        <div className="control-group">
          <label>User Privilege Level:</label>
          <select 
            value={selectedPrivilege} 
            onChange={(e) => setSelectedPrivilege(e.target.value as keyof typeof PRIVILEGE_MASKS)}
          >
            {Object.entries(PRIVILEGE_MASKS).map(([name, value]) => (
              <option key={name} value={name}>
                {name} (0b{value.toString(2).padStart(6, '0')} = {value})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Required Permission:</label>
          <div className="bit-selector">
            {permissionBits.map(({ name, bit }) => (
              <button
                key={name}
                className={`bit-toggle ${(requiredPermission & bit) === bit ? 'active' : ''}`}
                onClick={() => setRequiredPermission(prev => prev ^ bit)}
                title={PERMISSIONS[name as keyof typeof PERMISSIONS].description}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="binary-input">
            <label>Binary: 0b</label>
            <input
              type="text"
              value={customBitmask}
              onChange={(e) => updateCustomBitmask(e.target.value)}
              pattern="[01]{1,6}"
              maxLength={6}
            />
            <span> = {requiredPermission} (decimal)</span>
          </div>
        </div>
      </div>

      <div className="visualization">
        <div className="bit-grid">
          {permissionBits.map(({ name, bit, hasPrivilege, required }) => (
            <div key={name} className="bit-cell">
              <div className={`bit-indicator ${hasPrivilege ? 'has-privilege' : ''} ${required ? 'required' : ''}`}>
                {bit}
              </div>
              <div className="bit-label">{name}</div>
              <div className="bit-binary">0b{bit.toString(2).padStart(6, '0').slice(-6)}</div>
            </div>
          ))}
        </div>

        <div className="calculation">
          <div className="operation">
            <div>User Privilege: 0b{userPrivilege.toString(2).padStart(6, '0')} ({userPrivilege})</div>
            <div>Required Permission: 0b{requiredPermission.toString(2).padStart(6, '0')} ({requiredPermission})</div>
            <div className="operator">AND (&) Operation:</div>
            <div className="result">
              0b{(userPrivilege & requiredPermission).toString(2).padStart(6, '0')} = {userPrivilege & requiredPermission}
            </div>
          </div>

          <div className={`permission-result ${hasPermission ? 'granted' : 'denied'}`}>
            <h3>Permission: {hasPermission ? '✅ GRANTED' : '❌ DENIED'}</h3>
            <p>
              {hasPermission 
                ? 'The user has sufficient privileges for this operation.'
                : 'The user lacks the required permission bits.'}
            </p>
          </div>
        </div>
      </div>

      <div className="hierarchy">
        <h4>Permission Hierarchy</h4>
        <div className="hierarchy-tree">
          <div className="hierarchy-node owner">owner (63)</div>
          <div className="hierarchy-connector">↓ includes</div>
          <div className="hierarchy-node admin">admin (31)</div>
          <div className="hierarchy-connector">↓ includes</div>
          <div className="hierarchy-node delete">manager (15)</div>
          <div className="hierarchy-connector">↓ includes</div>
          <div className="hierarchy-node write">designer (7)</div>
          <div className="hierarchy-connector">↓ includes</div>
          <div className="hierarchy-node read">contributor (3)</div>
          <div className="hierarchy-connector">↓ includes</div>
          <div className="hierarchy-node anonymous">guest (1)</div>
        </div>
      </div>
    </div>
  );
}