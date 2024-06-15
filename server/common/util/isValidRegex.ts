/**
 * Check if the field is valid based on the regex.
 * @param field the field to validate
 * @param regex the regex to validate the field against
 * @returns true if the field is valid, false otherwise
 */
export const isValidRegex = (field: string, regex: RegExp): boolean => {
  if (!field) return false;
  const normalizedField: string = field.toLowerCase().trim();
  const valid = new RegExp(regex);
  if (!normalizedField || !valid.test(normalizedField)) {
    return false;
  }
  return true;
};
