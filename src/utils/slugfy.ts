export default function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[{}[\]/?.,;:|)*~`!^_\-+<>@#$%&\\=('"" "ㄱ-ㅎㅏ-ㅣ]/g, '-')
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '');
}
