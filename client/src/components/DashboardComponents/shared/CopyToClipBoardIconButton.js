/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Tooltip from '@material-ui/core/Tooltip';
import { toast } from 'react-toastify';

function CopyToClipBoardIconButton({
  clipBoardValue,
  disabled = false,
}) {
  return (
    <CopyToClipboard text={clipBoardValue == null ? 'N/A' : clipBoardValue}>
      <Tooltip title={disabled ? 'Disabled' : 'Referral link'}>
      <button type="button" disabled={disabled} id='clipboard-button'>
        <span
          role="button"
          onClick={() => {
            if (disabled) {
              toast.error('You are not allowed to refer.');
              return;
            }
            toast.success('Referral Link Copied.');
          }}
        >
          <i className="icon-copy" />
          Affiliate Link
        </span>
        </button>
      </Tooltip>
    </CopyToClipboard>
  );
}

export default CopyToClipBoardIconButton;
