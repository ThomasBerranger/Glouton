// Category classification configuration
interface CategoryConfig {
    keywords: string[];
    priority: string[];
    exclude: string[];
}

interface ClassificationResult {
    selectedCategory: string | null;
    confidence: number;
}

const categoryKeywords: Record<string, CategoryConfig> = {
    "1": {
        keywords: ["fruits", "vegetables", "plant-based", "fresh-fruits", "fresh-vegetables", "canned-fruits", "frozen-fruits", "fruit-based"],
        priority: ["fresh-fruits", "fresh-vegetables", "fruits", "vegetables"],
        exclude: ["juices", "beverages"]
    },

    "2": {
        keywords: ["dairy", "milk", "cheese", "yogurt", "yoghurt", "cream", "butter", "fermented-milk"],
        priority: ["dairy", "milk", "cheese", "yogurt", "yoghurt"],
        exclude: []
    },

    "3": {
        keywords: ["cereals", "breads", "pastas", "rice", "breakfast-cereals", "flour", "grains"],
        priority: ["breakfast-cereals", "cereals", "breads", "pastas", "rice"],
        exclude: []
    },

    "4": {
        keywords: ["meat", "fish", "seafood", "poultry", "beef", "pork", "chicken", "ham", "sausages", "processed-meat"],
        priority: ["meat", "fish", "seafood", "processed-meat"],
        exclude: []
    },

    "5": {
        keywords: ["chocolate", "candy", "confectionery", "sweet", "dessert", "biscuit", "cake", "jam", "honey", "sugary"],
        priority: ["chocolate", "confectionery", "sweet", "dessert", "biscuit"],
        exclude: ["dairy"]
    },

    "6": {
        keywords: ["beverages", "drinks", "juices", "sodas", "waters", "teas", "coffees"],
        priority: ["beverages", "juices", "sodas", "waters"],
        exclude: ["dairy"]
    },
};

// Main classification function
function selectBestCategory(categoriesTags: string[]): ClassificationResult {
    let bestCategory: string | null = null;
    let bestScore: number = -Infinity;

    // Check each category
    for (const [categoryId, config] of Object.entries(categoryKeywords)) {
        let score: number = 0;

        // Check each product tag
        categoriesTags.forEach((tag: string) => {
            const tagLower: string = tag.toLowerCase();

            // Check exclusion keywords
            const hasExclusion: boolean = config.exclude.some((exclude: string) => tagLower.includes(exclude));
            if (hasExclusion) {
                score -= 10; // Heavy penalty for exclusion
                return;
            }

            // Check priority keywords (higher score)
            config.priority.forEach((keyword: string, index: number) => {
                if (tagLower.includes(keyword)) {
                    const priorityBonus: number = config.priority.length - index;
                    score += priorityBonus * 3;
                }
            });

            // Check other keywords
            config.keywords.forEach((keyword: string) => {
                if (tagLower.includes(keyword) && !config.priority.includes(keyword)) {
                    score += 1;
                }
            });
        });

        // Update best category if score is better
        if (score > bestScore && score > 0) {
            bestScore = score;
            bestCategory = categoryId;
        }
    }

    if (bestCategory === null || bestScore <= 10) {
        bestCategory = "7";
    }

    return {
        selectedCategory: bestCategory,
        confidence: bestScore
    };
}

// Category display names
const productCategories: Record<string, string> = {
    "1": "Fruits & Légumes",
    "2": "Produits Laitiers",
    "3": "Céréales & Féculents",
    "4": "Viandes & Poissons",
    "5": "Produits Sucrés",
    "6": "Boissons",
    "7": "Autre",
};

export { selectBestCategory, productCategories, type ClassificationResult };