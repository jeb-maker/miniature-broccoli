import '../../dist/tokens/tokens.css';
import '../../dist/components/button.js';
import '../../dist/components/input.js';

const app = document.querySelector('#app')!;

app.innerHTML = `
  <main style="max-inline-size: 28rem; margin: 2rem auto; display: grid; gap: 1rem;">
    <h1 class="ds-title">Consumer smoke</h1>
    <p class="ds-body">Imports only button + input from dist/.</p>
    <form id="demo">
      <ds-input id="email" name="email" label="Email" type="email" required></ds-input>
      <div style="margin-block-start: 1rem;">
        <ds-button type="submit">Submit</ds-button>
      </div>
    </form>
    <pre id="out" class="ds-body-sm"></pre>
  </main>
`;

const form = document.querySelector('#demo') as HTMLFormElement;
const out = document.querySelector('#out') as HTMLPreElement;

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  out.textContent = JSON.stringify(Object.fromEntries(data.entries()), null, 2);
});
