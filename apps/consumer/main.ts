import '../../dist/tokens/tokens.css';
import '../../dist/components/button.js';
import '../../dist/components/input.js';

const app = document.querySelector('#app')!;

app.innerHTML = `
  <main style="max-inline-size: min(28rem, 100%); margin: 0 auto; padding: 1.25rem; display: grid; gap: 1rem; box-sizing: border-box; min-inline-size: 0;">
    <h1 class="mb-title">Consumer smoke</h1>
    <p class="mb-body">Imports only button + input from dist/.</p>
    <form id="demo" style="min-inline-size: 0; max-inline-size: 100%;">
      <mb-input id="email" name="email" label="Email" type="email" required></mb-input>
      <div style="margin-block-start: 1rem;">
        <mb-button type="submit">Submit</mb-button>
      </div>
    </form>
    <pre id="out" class="mb-body-sm" style="max-inline-size: 100%; overflow-x: auto; white-space: pre-wrap;"></pre>
  </main>
`;

const form = document.querySelector('#demo') as HTMLFormElement;
const out = document.querySelector('#out') as HTMLPreElement;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  out.textContent = JSON.stringify(Object.fromEntries(data.entries()), null, 2);
});
