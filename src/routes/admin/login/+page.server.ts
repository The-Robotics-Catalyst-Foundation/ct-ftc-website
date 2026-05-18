import { fail, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // If the administrator is already logged in, bypass this page
    if (pb.authStore.isValid) {
        throw redirect(303, '/admin');
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, { 
                email, 
                error: 'Please enter both your email and password.' 
            });
        }

        try {
            // Authenticate directly via your PocketBase collection
            await pb.collection('users').authWithPassword(email, password);
        } catch (err: any) {
            console.error('Authentication failure:', err);
            return fail(400, { 
                email, 
                error: 'Invalid authentication credentials.' 
            });
        }

        // Redirect to the dashboard root on success
        throw redirect(303, '/admin');
    }
};