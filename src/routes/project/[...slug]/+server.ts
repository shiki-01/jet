import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
    const slug = params.slug || [];

    return {
        props: {
            slug,
        },
    };
};