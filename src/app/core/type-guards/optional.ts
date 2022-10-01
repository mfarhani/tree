export type Optional<T> = T | undefined;

export function isPresent<T>(opt: Optional<T>): opt is T {
  return opt !== undefined;
}

export function toOptional<T>(val: T | null): Optional<T> {
  let newVal: Optional<T>;
  if (val === null) {
    newVal = undefined;
  } else {
    newVal = val;
  }
  return newVal;
}
