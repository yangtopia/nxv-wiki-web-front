export default function nicknamePurifier(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[{}[\]/?.,;:|)*~`!^\-+<>@#$%&\\=('"ㄱ-ㅎㅏ-ㅣ]/g, '')
    .trim()
    .replace(/ /g, '_');
}
