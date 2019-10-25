export default (...classnames) =>
  [...classnames]
    .filter(name => !!name)
    .join(" ")
    .trim();
