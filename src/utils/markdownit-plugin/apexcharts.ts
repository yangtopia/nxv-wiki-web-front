import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import Renderer from 'markdown-it/lib/renderer';

const ApexPlugIn = (md: MarkdownIt, opts: any) => {
  const defaultRenderer = md.renderer.rules.fence.bind(md.renderer.rules);

  const copyMdit = { ...md };

  copyMdit.renderer.rules.fence = (
    tokens: Token[],
    idx: number,
    options: any,
    env: any,
    self: Renderer,
  ) => {
    const token = tokens[idx];
    const trimedTokenContent = token.content.trim();
    if (token.info === 'apex') {
      try {
        const json = JSON.parse(trimedTokenContent);
        const ApexChartsId = `Apex${Math.floor(Math.random() * 100) + 1}`;
        const jsonStr = JSON.stringify(json);

        const el = `<div ${self.renderAttrs(
          token,
        )} type="apexChart" data-options='${jsonStr}'  id=${ApexChartsId}  ></div>`;
        return el;
      } catch (err) {
        return `<pre>${err}</pre>`;
      }
    }

    return defaultRenderer(tokens, idx, options, env, self);
  };
};

export default ApexPlugIn;
