import React from 'react';

/* Textové pole s popiskom. Dizajn systém má len SearchField (pilulka s lupou),
 * formuláre však potrebujú bežný vstup — staviame ho z rovnakých tokenov. */
export function Field({ label, value, onChange, placeholder, type = 'text', multiline = false, style, ...rest }) {
  const control = {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    font: 'var(--text-body)',
    color: 'var(--text-primary)',
    resize: multiline ? 'vertical' : undefined,
    minHeight: multiline ? 64 : undefined,
  };

  return (
    <label style={{ display: 'block', ...style }}>
      <span style={{
        display: 'block', font: 'var(--text-caption)', color: 'var(--text-tertiary)',
        marginBottom: 'var(--space-2)',
      }}>
        {label}
      </span>
      <span style={{
        display: 'block', padding: '10px 16px',
        borderRadius: multiline ? 'var(--radius-sm)' : 'var(--radius-pill)',
        background: 'var(--surface-glass)', border: '1px solid var(--line-glass-soft)',
        backdropFilter: 'var(--glass)', WebkitBackdropFilter: 'var(--glass)',
      }}>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            style={control}
            {...rest}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            style={control}
            {...rest}
          />
        )}
      </span>
    </label>
  );
}
