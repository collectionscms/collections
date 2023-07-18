import husky from 'husky';

// Workaround for husky install failing when npm publish.
// see: https://typicode.github.io/husky/guide.html
if (process.env.RELEASE !== 'true') {
  husky.install();
}
