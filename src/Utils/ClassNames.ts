export default (...classnames: Array<string | boolean | null | undefined>) =>
  [...classnames]
    .filter(name => !!name)
    .join(" ")
    .trim();
