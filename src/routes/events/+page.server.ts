import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';

export interface RoboticsEvent {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
    name: string;
    location: string;
    date_time: string;
    pics: string[];
}

export const load: PageLoad = async () => {
    try {
        const records = await pb.collection('events').getFullList<RoboticsEvent>({
            sort: '-date_time',
        });

        return {
            events: JSON.parse(JSON.stringify(records)) as RoboticsEvent[],
            error: null
        };
    } catch (err) {
        console.error(err);
        return {
            events: [] as RoboticsEvent[],
            error: 'Database communication matrix failure.'
        };
    }
};