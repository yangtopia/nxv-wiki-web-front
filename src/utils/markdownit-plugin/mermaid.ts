import Mermaid from 'mermaid';

import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import Renderer from 'markdown-it/lib/renderer';

const MermaidChart = (code: string) => {
  try {
    let c = code;
    const needsUniqueId = `render${Math.floor(
      Math.random() * 10000,
    ).toString()}`;

    Mermaid.mermaidAPI.render(needsUniqueId, code, (sc) => {
      c = sc;
    });
    return `<div class="mermaid">${c}</div>`;
  } catch ({ str, hash }) {
    return `<pre>${str}</pre>`;
  }
};

const MermaidPlugIn = (md: MarkdownIt, opts: any) => {
  Mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'true',
    theme: 'default',
    flowchart: {
      htmlLabels: false,
    },
    ...opts,
  });

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
    const code = `${token.info} \n ${token.content.trim()}`;
    if (
      token.info === 'mermaid' ||
      token.info === 'gantt' ||
      token.info === 'sequenceDiagram' ||
      token.info === 'classDiagram' ||
      token.info === 'gitGraph' ||
      token.info.match(/^graph (?:TB|BT|RL|LR|TD);?$/)
    ) {
      return MermaidChart(code);
    }
    return defaultRenderer(tokens, idx, options, env, self);
  };
};

export default MermaidPlugIn;
