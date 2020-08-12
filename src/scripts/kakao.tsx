import React from 'react';

const KakaoJavascriptKey = process.env.NXV_ENV.KAKAO_JAVASCRIPT_KEY;

const KAKAO_SCRIPT = `
  window.Kakao.init('${KakaoJavascriptKey}');
`;

export function KakaoInitScript() {
  // eslint-disable-next-line react/no-danger
  return <script type="" dangerouslySetInnerHTML={{ __html: KAKAO_SCRIPT }} />;
}
