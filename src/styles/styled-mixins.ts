import { css } from 'styled-components';

export const TextOverflowEllipsis = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const LeftRightBorderStyle = css`
  background-color: #ffffff;
  border-color: #cccccc;
  border-right: 0.1px solid;
  border-left: 0.1px solid;
`;

export const MainLayoutResponsiveWidth = css`
  @media (max-width: ${(props) => props.theme.breakPoint.lg}) {
    max-width: 960px;
  }
  @media (min-width: ${(props) =>
      props.theme.breakPoint.lg}) and (max-width: ${(props) =>
      props.theme.breakPoint.xl}) {
    max-width: 1280px;
  }
  @media (min-width: ${(props) => props.theme.breakPoint.xl}) {
    max-width: 1610px;
  }
`;

export const ArticleLayoutResponsiveWidth = css`
  @media (min-width: ${(props) =>
      props.theme.breakPoint.xs}) and (max-width: ${(props) =>
      props.theme.breakPoint.md}) {
    max-width: 100%;
  }
  @media (min-width: ${(props) =>
      props.theme.breakPoint.md}) and (max-width: ${(props) =>
      props.theme.breakPoint.lg}) {
    max-width: 690px;
  }
  @media (min-width: ${(props) =>
      props.theme.breakPoint.lg}) and (max-width: ${(props) =>
      props.theme.breakPoint.xl}) {
    max-width: 970px;
  }
  @media (min-width: ${(props) => props.theme.breakPoint.xl}) {
    max-width: 1300px;
  }
`;

export const FlexSpaceBetween = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MarkdownStyle = css`
  font-size: 14px;
  img {
    max-width: 75%;
  }
  code {
    font-family: inherit;
    padding: 2px 0.4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
  }
  pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    code {
      padding: 0;
      font-size: inherit;
      color: inherit;
      white-space: pre;
      background-color: transparent;
      border-radius: 0;
      white-space: break-spaces;
    }
  }
  a {
    color: #428bca;
    text-decoration: none;
  }
  blockquote {
    padding: 10px 2px;
    margin: 0 0 2px;
    font-size: 1.75px;
    border-left: 5px solid #eee;
  }
  mark {
    padding: 0.2px;
    background-color: #fcf8e3;
  }
  dt {
    font-weight: bold;
  }
  dd {
    margin-left: 0;
  }
  abbr[title] {
    text-decoration: underline dotted;
    cursor: help;
    border-bottom: 1px dotted #777;
  }
  hr {
    height: 0;
    box-sizing: content-box;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  table {
    max-width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
    tbody {
      tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    th {
      font-weight: bold;
      padding: 10px;
      vertical-align: bottom;
      border-top: 1px solid #dee2e6;
      border-bottom: 2px solid #dee2e6;
    }
    td {
      padding: 10px;
      vertical-align: top;
      border-top: 1px solid #dee2e6;
    }
  }
  iframe {
    max-width: 560px;
  }

  p {
    word-break: break-all;
    &.align {
      &--center {
        text-align: center;
      }
      &--left {
        text-align: left;
      }
      &--right {
        text-align: right;
      }
    }
    &.color {
      &--red {
        color: red;
      }
      &--blue {
        color: blue;
      }
    }
    &.width {
      &--100 {
        img {
          max-width: 100%;
          width: 100%;
        }
      }
      &--75 {
        img {
          max-width: 75%;
          width: 75%;
        }
      }
      &--50 {
        img {
          max-width: 50%;
          width: 50%;
        }
      }
      &--25 {
        img {
          max-width: 25%;
          width: 25%;
        }
      }
    }
  }
  h1,
  h2,
  h3,
  h4 {
    a {
      margin-right: 10px;
    }
  }
  details {
    summary {
      font-weight: bold;
      font-size: 20px;
      color: #428bca;
      outline: none;
    }
    margin-bottom: 10px;
    cursor: pointer;
  }
  .table-of-contents {
    @media (min-width: ${(props) => props.theme.breakPoint.lg}) {
      max-width: 50%;
    }
    border: 1px solid #ccc;
    border-radius: 8px;
    ol {
      counter-reset: item;
      padding-left: 30px;
    }
    li {
      display: block;
    }
    li:before {
      content: counters(item, '.') ' ';
      counter-increment: item;
    }
  }
  .table-wrapper {
    overflow-x: scroll;
  }
  .center-box {
    display: flex;
    flex-direction: column;
    overflow-x: scroll;
    & > * {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;
