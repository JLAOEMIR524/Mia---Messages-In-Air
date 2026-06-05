export function cleanPostcardtext(text: string): string {
  if (text.includes("\n")) {
    const lines = text.split("\n");

    // Only apply the cleaning logic if there's actual multiline text
    if (lines.length > 1) {
      // Define how many line breaks we allow at the very end (3 breaks = up to 4 lines)
      const maxAllowedBreaks = 3;

      // Separate the main body lines from the protected sign-off lines at the end
      const mainBodyLines = lines.slice(0, -(maxAllowedBreaks + 1));
      const closingLines = lines.slice(-(maxAllowedBreaks + 1));

      // It keeps a line only if it has text, or if it's empty but the previous line wasn't
      const cleanedMainBody = mainBodyLines
        .filter((line, index, arr) => {
          return (
            line.trim() !== "" || (index > 0 && arr[index - 1].trim() !== "")
          );
        })
        .join("\n");

      // Reassemble the text by putting the cleaned body and the closing lines back together
      if (mainBodyLines.length > 0) {
        // Prevent adding a double break if the body already ends with a break or closing starts empty
        const separator =
          cleanedMainBody.endsWith("\n") || closingLines[0] === "" ? "" : "\n";
        text = cleanedMainBody + separator + closingLines.join("\n");
      } else {
        text = closingLines.join("\n");
      }
    }

    text.replace(/\n{3,}/g, "\n\n");
  }
  return text;
}
