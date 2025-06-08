/**
 * Applies basic HTML formatting tags around the selected text in a contenteditable element.
 * Currently supports a simple replacement logic based on window.getSelection.
 * @param {string} text - The original text content.
 * @param {string} tag - The HTML tag to apply (e.g., 'b', 'i').
 * @returns {string} The modified text with the applied formatting.
 */
export function applyFormat(text, tag) {
  // This is a simplified implementation. A more robust solution might involve
  // rich text editing libraries or more complex DOM manipulation.
  // For now, it attempts to find the selected text and wrap it.

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return text;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  // Ensure selectedText is not empty
  if (!selectedText) return text;

  // Simple replacement (might not work correctly with nested tags or complex structures)
  // A better approach would be to manipulate the DOM nodes within the range.
  return text.replace(selectedText, `<${tag}>${selectedText}</${tag}>`);
}
