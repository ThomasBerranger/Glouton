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

const productCategories: Record<string, object> = {
    1: {'name': 'Fruits & Légumes', 'icon': 'fa-solid fa-carrot'},
    2: {'name': 'Produits Laitiers', 'icon': 'fa-solid fa-cheese'},
    3: {'name': 'Céréales & Féculents', 'icon': 'fa-solid fa-wheat-awn'},
    4: {'name': 'Viandes & Poissons', 'icon': 'fa-solid fa-drumstick-bite'},
    5: {'name': 'Produits Sucrés', 'icon': 'fa-solid fa-cookie-bite'},
    6: {'name': 'Boissons', 'icon': 'fa-solid fa-bottle-water'},
    7: {'name': 'Autre', 'icon': 'fa-solid fa-shopping-basket'},
};

export {selectBestCategory, productCategories, type ClassificationResult};