import { ColorSwatch } from '@/types/ui';

import { moodboardColorPalette } from './dataMoodboard';

interface MoodboardPageData {
    colorPalette: ColorSwatch[];
}

export default function useMoodboardPage(): MoodboardPageData {
    return {
        colorPalette: moodboardColorPalette,
    };
}
