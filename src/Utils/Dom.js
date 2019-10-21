export default function findClosestElementWithClass(
  elementWithClass,
  className
) {
  let el = elementWithClass;
  const isClassInEl = () => el.classList.contains(className);

  if (Array.isArray(className)) {
    while (el && !className.some(isClassInEl)) {
      el = el.parentElement;
    }
  } else {
    while (el && !isClassInEl(className)) {
      el = el.parentElement;
    }
  }
  return el || null;
}
