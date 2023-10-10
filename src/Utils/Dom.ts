

export default function findClosestElementWithClass(
  elementWithClass: HTMLElement,
  className: string | string[]
) {
  let el = elementWithClass;
  const isClassInEl = (className: string) => el.classList.contains(className);

  if (Array.isArray(className)) {
    while (el && !className.some(isClassInEl) && el.parentElement) {
      el = el.parentElement;
    }
  } else {
    while (el && !isClassInEl(className) && el.parentElement) {
      el = el.parentElement;
    }
  }
  return el || null;
}
