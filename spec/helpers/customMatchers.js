const customMatchers = {
    toEqualLines: function() {
        return {
            compare: function(actual, expected) {
                const result = {
                    pass: true,
                    message: ''
                }
                if (actual.length == expected.length && actual == expected) {
                    return result;
                }
                result.pass = false;
                actualLines = actual.split('\n');
                expectedLines = expected.split('\n');
                
                for (const [index, expectedLine] of expectedLines.entries()) {
                    if (index >= actualLines.length) {
                        result.message = `${result.message}[${index}:] Expected '${expectedLine}' but found EOF\n`;
                        break;
                    } else {
                        const actualLine = actualLines[index];
                        if (actualLine != expectedLine) {
                            result.message = `${result.message}[${index}:] Expected '${actualLine}' to equal '${expectedLine}'\n`;
                        }
                    }
                }
                if (actualLines.length > expectedLines.length) {
                    const n = expectedLines.length;
                    const extraLines = actualLines.splice(n);
                    for (const [index, extraLine] of extraLines.entries()) {
                        result.message = `${result.message}[${index + n}:] Expected EOF but found '${extraLine}'\n`;
                    }
                }
                return result;
            }
        }
    }
}
  