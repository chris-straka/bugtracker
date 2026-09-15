import { css } from 'lit'

/** Shared form/card primitives. Each component composes these into its own
 *  scoped `static styles`, so the fragment below never leaks globally. */
export const sharedStyles = css`
  .card {
    background: #fff;
    border: 1px solid #e2e5ea;
    border-radius: 10px;
    padding: 1rem 1.25rem;
    box-shadow: 0 1px 2px rgb(16 24 40 / 0.06);
  }
  form.stack,
  .stack {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #344054;
  }
  input,
  select,
  textarea {
    font: inherit;
    font-weight: 400;
    padding: 0.5rem 0.65rem;
    border: 1px solid #cfd4dc;
    border-radius: 6px;
  }
  textarea {
    min-height: 4rem;
    resize: vertical;
  }
  button {
    font: inherit;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border: 1px solid #175cd3;
    border-radius: 6px;
    background: #175cd3;
    color: #fff;
    cursor: pointer;
  }
  button[disabled] {
    opacity: 0.6;
    cursor: wait;
  }
  button.ghost {
    background: transparent;
    color: #175cd3;
  }
  button.danger {
    background: transparent;
    color: #b42318;
    border-color: #b42318;
  }
  .error {
    background: #fef3f2;
    border: 1px solid #fecdca;
    color: #b42318;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  .muted {
    color: #667085;
    font-size: 0.85rem;
  }
  .row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }
  ul.clean {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  a {
    color: #175cd3;
  }
`
