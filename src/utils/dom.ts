/**
 * HTML要素の配列`elements`に対し以下の処理を行う
 *
 * - `targetIndex`番目の要素にフォーカスを当てる
 * - `targetIndex`番目の要素は`tabIndex = 0`, それ以外は`tabIndex = -1`にセットする
 */
export const selectFocus = <T extends HTMLElement>(
  elements: T[],
  targetIndex: number
) => {
  elements[targetIndex].focus();
  elements.forEach((element, index) => {
    element.tabIndex = index === targetIndex ? 0 : -1;
  });
};
