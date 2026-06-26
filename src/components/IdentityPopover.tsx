import { USER_COLORS, type Identity } from '../collab/identity'
import { usePopover } from '../lib/usePopover'
import { UserIcon } from '../lib/icons'

interface IdentityPopoverProps {
  identity: Identity
  onChange: (identity: Identity) => void
}

export default function IdentityPopover({ identity, onChange }: IdentityPopoverProps) {
  const { open, anchorRef, toggle } = usePopover()

  return (
    <div className="popover-anchor" ref={anchorRef}>
      <button
        type="button"
        className="btn btn--icon"
        onClick={toggle}
        title="Your identity"
        aria-label="Edit your name and color"
        style={{ position: 'relative' }}
      >
        <span
          style={{
            position: 'absolute',
            inset: 3,
            borderRadius: 6,
            background: identity.color,
            opacity: 0.18,
          }}
        />
        <UserIcon style={{ color: identity.color, position: 'relative' }} />
      </button>

      {open && (
        <div className="popover" role="dialog" aria-label="Your identity">
          <p className="popover__title">How others see you</p>
          <span className="field-label">Display name</span>
          <input
            className="text-input"
            value={identity.name}
            maxLength={32}
            autoFocus
            onChange={(e) => onChange({ ...identity, name: e.target.value })}
            placeholder="Your name"
          />
          <span className="field-label" style={{ marginTop: 16 }}>
            Cursor color
          </span>
          <div className="swatches">
            {USER_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`swatch${color === identity.color ? ' swatch--active' : ''}`}
                style={{ background: color }}
                onClick={() => onChange({ ...identity, color })}
                aria-label={`Use color ${color}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
