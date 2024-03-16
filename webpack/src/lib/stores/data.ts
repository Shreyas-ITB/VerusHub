import {writable} from "svelte/store";

export const nodeData = writable<NodeData>();

export const blogPosts = writable([])

export const supplyData = writable<SupplyData>();

import axios from 'axios';

export function getBlockCount(): Promise<number> {
    return axios.get('https://explorer.verus.io/api/getblockcount')
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching block count:', error);
            throw error;
        });
}
