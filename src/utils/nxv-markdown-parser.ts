import mdit from 'markdown-it';
import mditDefList from 'markdown-it-deflist';
import mditEmoji from 'markdown-it-emoji';
import mditFootnote from 'markdown-it-footnote';
import mditSub from 'markdown-it-sub';
import mditSup from 'markdown-it-sup';
import mditMark from 'markdown-it-mark';
import mditIns from 'markdown-it-ins';
import mditContainer from 'markdown-it-container';
import mditTexMath from 'markdown-it-texmath';
import mditAnchor from 'markdown-it-anchor';
import mditTocDoneRight from 'markdown-it-toc-done-right';
// import mditAutoParnum from 'markdown-it-auto-parnum';
import mditAttrs from 'markdown-it-attrs';
import mditMultiMdtable from 'markdown-it-multimd-table';
import mditVideo from 'markdown-it-video';
import katex from 'katex';
import hljs from 'highlight.js';

import mditMermaid from '@utils/markdownit-plugin/mermaid';
import mditApexcharts from '@utils/markdownit-plugin/apexcharts';
import mditAutoParnum from '@utils/markdownit-plugin/auto-parnum';

export default (markdown: string): string => {
  const mdParser = mdit({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
          // eslint-disable-next-line no-empty
        } catch (_) {}
      }
      return '';
    },
    html: false,
    typographer: true,
    breaks: true,
    linkify: true,
  })
    .use((md) => {
      const copy = { ...md };
      const rules = md.renderer.rules;
      copy.renderer.rules = {
        ...rules,
        ...{
          table_close: () => `</table>\n</div>`,
          table_open: () => `<div class="table-wrapper">\n<table>\n`,
          link_open: (tokens, idx, options, env, self) => {
            const href = tokens[idx].attrGet('href');
            return `<a href="${href}" target="_blank">`;
          },
          link_close: () => `</a>`,
        },
      };
    })
    .use(mditVideo)
    .use(mditAttrs, {
      leftDelimiter: '{',
      rightDelimiter: '}',
      allowedAttributes: ['id', 'class'],
    })
    .use(mditMultiMdtable, {
      multiline: true,
      rowspan: true,
    })
    .use(mditSub)
    .use(mditSup)
    .use(mditFootnote)
    .use(mditDefList)
    .use(mditMark)
    .use(mditIns)
    .use(mditEmoji)
    .use(mditMermaid)
    .use(mditApexcharts)
    .use(mditAutoParnum, {
      headingLevels: 3,
      numberedElements: 'h4',
      showUnNestedParnum: true,
    })
    .use(mditAnchor, {
      permalink: false,
      permalinkBefore: true,
      permalinkSpace: true,
    })
    .use(mditTocDoneRight, {
      level: '1',
      listType: 'ol',
    })
    .use(mditTexMath.use(katex), {
      delimiters: 'dollars',
      macros: { '\\RR': '\\mathbb{R}' },
    })
    .use(mditContainer, 'details', {
      validate: (params: string) => {
        return params.trim().match(/^details\s+(.*)$/);
      },

      render: (tokens: any, idx: number) => {
        const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<details><summary>${mdParser.utils.escapeHtml(
            m[1],
          )}</summary>\n`;
        }
        return `</details>\n`;
      },
    })
    .use(mditContainer, 'center-box', {
      validate: (params: string) => {
        return params.trim().match(/^center-box/);
      },

      render: (tokens: any, idx: number) => {
        if (tokens[idx].nesting === 1) {
          return `<div class="center-box">\n`;
        }
        return `</div>\n`;
      },
    });
  return mdParser.render(markdown);
};
