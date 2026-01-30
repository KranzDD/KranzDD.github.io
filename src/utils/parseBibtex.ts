
export type Publication = {
    id: string;
    title: string;
    author: string;
    year: string;
    venue: string;
    url?: string;
    month?: string;
    type: string;
};

function cleanLatex(text: string): string {
    if (!text) return "";
    let clean = text;

    // Remove outer braces
    if (clean.startsWith('{') && clean.endsWith('}')) {
        clean = clean.slice(1, -1);
    }

    // Basic LaTeX command replacement
    const replacements: [RegExp, string][] = [
        [/\\{\\"\{a\}\}/g, "ä"],
        [/\\{\\"\{o\}\}/g, "ö"],
        [/\\{\\"\{u\}\}/g, "ü"],
        [/\\{\\"\{A\}\}/g, "Ä"],
        [/\\{\\"\{O\}\}/g, "Ö"],
        [/\\{\\"\{U\}\}/g, "Ü"],
        [/\\ss/g, "ß"],
        [/\\{\\c\{c\}\}/g, "ç"],
        [/\\{\\c\{C\}\}/g, "Ç"],
        [/\\c\{c\}/g, "ç"],
        [/\\c\{C\}/g, "Ç"],
        [/\\'\{e\}/g, "é"],
        [/\\'\{a\}/g, "á"],
        [/\\'e/g, "é"],
        [/--/g, "–"], // en-dash
        [/[{}]/g, ""], // Remove remaining braces
    ];

    for (const [pattern, replacement] of replacements) {
        clean = clean.replace(pattern, replacement);
    }

    // Clean up whitespace
    return clean.replace(/\s+/g, ' ').trim();
}

export function parseBibtex(content: string): Publication[] {
    const entries: Publication[] = [];
    // Split by @entrytype{
    const rawEntries = content.split(/@\w+\s*\{/);

    // Skip the first empty chunk before the first entry
    for (let i = 1; i < rawEntries.length; i++) {
        const entryBlock = rawEntries[i].trim();
        if (!entryBlock) continue;

        // The ID is effectively everything up to the first comma
        const idMatch = entryBlock.match(/^([^,]+),/);
        if (!idMatch) continue;
        const id = idMatch[1].trim();

        // Extract fields
        const getField = (fieldName: string) => {
            // Regex to find fieldName = { ... } or fieldName = " ... "
            const regex = new RegExp(`${fieldName}\\s*=\\s*[\\{"](.*?)[\\}"](?=[,\\n\\r])`, 'i');
            // Regex for numbers
            const numberRegex = new RegExp(`${fieldName}\\s*=\\s*(\\d+)`, 'i');
            // Regex for unquoted strings (macros like feb, jun, etc.)
            const macroRegex = new RegExp(`${fieldName}\\s*=\\s*([a-zA-Z]+)(?=[,\\n\\r])`, 'i');

            const match = entryBlock.match(regex);
            if (match) return cleanLatex(match[1]);

            const numMatch = entryBlock.match(numberRegex);
            if (numMatch) return numMatch[1];

            const macroMatch = entryBlock.match(macroRegex);
            if (macroMatch) return macroMatch[1];

            return "";
        };

        const title = getField("title");
        const author = getField("author");
        const year = getField("year");
        const month = getField("month");
        const url = getField("url");
        let venue = getField("journal");
        if (!venue) venue = getField("booktitle");
        if (!venue) venue = getField("publisher"); // Fallback for misc/articles without journal
        if (!venue) venue = "Preprint"; // Fallback

        const type = "article"; // Simplify for now

        if (title) {
            entries.push({
                id,
                title,
                author,
                year,
                month, // Add month to object (implicitly added to type if not strict, but I'll update type separately if needed, TS might complain if I don't update type definition first, but `parseBibtex` return type is explicit. The user file has explicit type. I should update that too.)
                venue,
                url,
                type
            });
        }
    }

    // Helper to parse month to number (0-11)
    const getMonthNum = (m?: string) => {
        if (!m) return -1;
        const normalized = m.toLowerCase().trim();
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        // Check for 3-letter match
        const index = months.findIndex(mon => normalized.startsWith(mon));
        if (index !== -1) return index;

        // Check for numeric
        const num = parseInt(normalized);
        if (!isNaN(num)) return num - 1; // 1-12 -> 0-11

        return -1;
    };

    // Sort by year descending, then month descending
    return entries.sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        if (yearB !== yearA) {
            return yearB - yearA;
        }

        const monthA = getMonthNum(a.month);
        const monthB = getMonthNum(b.month);
        if (monthB !== monthA) {
            return monthB - monthA;
        }

        // Secondary sort by title so order is deterministic
        return a.title.localeCompare(b.title);
    });
}
