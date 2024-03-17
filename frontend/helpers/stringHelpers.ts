class StringHelpers {
    static removeUnderscoresAndCapitalizeFirst(input?: string): string {
        if (!input) {
            return '';
        }
    
        const words = input.split('_');
        
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    
        for (let i = 1; i < words.length; i++) {
            words[i] = words[i].toLowerCase();
        }
    
        return words.join(' ');
    }
}

export default StringHelpers;
