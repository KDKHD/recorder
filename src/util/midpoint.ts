const findMidpoint = (
  a: [number, number],
  b: [number, number]
): [number, number] => {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const midpointX = (x1 + x2) / 2;
  const midpointY = (y1 + y2) / 2;
  return [midpointX, midpointY];
};
export default findMidpoint;
