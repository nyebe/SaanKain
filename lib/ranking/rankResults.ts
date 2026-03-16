import { RestaurantResult } from '@/types/restaurant';
import { ParsedSearch } from '@/types/search';

function computeScore(result: RestaurantResult, parsed: ParsedSearch): number {
    let score = 0;

    // Cuisine / category match (+4)
    if (parsed.cuisine && result.category) {
        const cuisineLower = parsed.cuisine.toLowerCase();
        const categoryLower = result.category.toLowerCase();
        if (categoryLower.includes(cuisineLower) || cuisineLower.includes(categoryLower)) {
            score += 4;
        }
    }

    // Price match (+3)
    if (
        parsed.priceLevel !== null &&
        parsed.priceLevel !== undefined &&
        result.price !== null &&
        result.price !== undefined
    ) {
        if (result.price === parsed.priceLevel) {
            score += 3;
        }
    }

    // Open status match (+2)
    if (parsed.openNow === true && result.isOpen === true) {
        score += 2;
    }

    // High rating boost, when available (+2 if rating > 8.0)
    if (result.rating !== null && result.rating !== undefined && result.rating > 8) {
        score += 2;
    }

    return score;
}

export function rankResults(results: RestaurantResult[], parsed: ParsedSearch): RestaurantResult[] {
    return [...results].sort((resultA, resultB) => {
        const scoreA = computeScore(resultA, parsed);
        const scoreB = computeScore(resultB, parsed);

        if (scoreB !== scoreA) return scoreB - scoreA;

        // Distance as tie-breaker (closer = better)
        const distA = resultA.distance ?? Infinity;
        const distB = resultB.distance ?? Infinity;
        return distA - distB;
    });
}
